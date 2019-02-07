import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { navigation } from 'react-native-zapp-bridge';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { path, last, prop } from 'ramda';
import { withSwipeTapBlocker } from '@applicaster/london-rn-components';

import {
  FixtureTime,
  FixtureReminder,
  BlockHeader,
  SecondaryHeader
} from './index';
import colors from '../styles/colors';
import { isCompact } from '../helpers/responsive';
import { isGameLive } from '../../util';

const TouchableOpacityWithBlocker = withSwipeTapBlocker(TouchableOpacity);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    width: '100%'
  },
  touchable: {
    // want this to be minHeight - but causes issue with future events
    height: 52,
    backgroundColor: '#ffffff'
  },
  inner: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%'
  },
  left: { textAlign: 'right', marginRight: 6, marginLeft: 0 },
  team: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    marginRight: 0,
    marginLeft: 6,
    color: '#414954'
  },
  teamSmall: { fontSize: 11 },
  teamBadge: { width: 22, height: 22 },
  scoreWrapper: {
    padding: 4,
    borderWidth: 1,
    marginHorizontal: 9,
    borderRadius: 3,
    alignSelf: 'center'
  },
  scoreWrapperFuture: { padding: 4, alignSelf: 'center' },
  score: { fontSize: 14, fontWeight: '800', textAlign: 'center' },
  pastScore: { color: '#414954' },
  liveScore: { color: '#FFFFFF' },
  futureScore: { color: '#FFFFFF' },
  pastScoreWrapper: { backgroundColor: colors.past, borderColor: colors.past },
  liveScoreWrapper: {
    backgroundColor: colors.present,
    borderColor: colors.present
  },
  futureScoreWrapper: {
    backgroundColor: colors.future,
    borderColor: colors.future
  },
  meta: { alignItems: 'center', justifyContent: 'center' },
  topMeta: { paddingBottom: 5 },
  bottomMeta: { paddingTop: 5 },
  metaTitle: { color: '#49494a', fontSize: 10, fontWeight: '500' },
  metaText: { color: '#a0aab4', fontSize: 10 },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3
  },
  middleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  }
});

const deviceWidth = Dimensions.get('window').width;

export default class Fixture extends PureComponent {
  handlePress(feedUrl) {
    const params = {
      bundle: 'APSportLiveMatch-RN',
      plugin: 'APSportLiveMatch',
      presentation: 'presentNoNavigation',
      'reactProps[dataUrl]': feedUrl
    };

    navigation.openInternalURL('ransports', params);
  }

  getBadge(image) {
    return isCompact() ? null : (
      <Image source={image} style={styles.teamBadge} />
    );
  }

  getScore(homeScore, awayScore, status) {
    if (status === 'future') {
      return (
        <View style={styles.scoreWrapperFuture}>
          <Text>{' : '}</Text>
        </View>
      );
    }
    const scoreColor = styles[`${status}Score`];
    const scoreWrapperColor = styles[`${status}ScoreWrapper`];
    const scoreStyle = [styles.score, scoreColor];

    return (
      <View style={[styles.scoreWrapper, scoreWrapperColor]}>
        <Text style={scoreStyle}>
          {homeScore} : {awayScore}
        </Text>
      </View>
    );
  }

  getTeamName(team, score, left) {
    const teamStyles = [styles.team];

    if (left) {
      teamStyles.push(styles.left);
    }

    if (score.length > 2) {
      teamStyles.push(styles.teamSmall);
    }

    return (
      <Text style={teamStyles}>
        {deviceWidth >= 768 ? team.name : team.shortname}
      </Text>
    );
  }

  getStatus(game) {
    const finished = game.finished !== 'no';
    const isLive = isGameLive(game);

    if (isLive) return 'live';
    if (finished) return 'past';
    return 'future';
  }

  getHeader(title, titleMargin, game) {
    const splitTitle = title.split('<competition>');
    if (splitTitle.length > 1) {
      const subTitle = last(splitTitle);
      const championship = prop('championship', game) || '';
      return (
        <SecondaryHeader {...{ title: championship, titleMargin, subTitle }} />
      );
    }
    return <SecondaryHeader {...{ title, titleMargin }} />;
  }

  render() {
    const { game, title, secondTitle, index } = this.props;
    const feedUrl = prop('feedUrl', game);
    const homeLogo = { uri: path(['home', 'image'], game) };
    const awayLogo = { uri: path(['away', 'image'], game) };
    const status = this.getStatus(game);
    // temp till we can get this data from feed
    const competition = '';
    const metaText1 = ''; // example: Final
    const metaTitle2 = ''; // example: Agg 2-2 AET

    // const venueName = path(['venue', 'name'], game);
    const venue = '';

    const homeScore = path(['match_result', '0', 'match_result'], game);
    const awayScore = path(['match_result', '1', 'match_result'], game);
    const { id: gameId } = game;
    const titleMargin = index > 0;

    return (
      <View style={styles.container}>
        {title ? this.getHeader(title, titleMargin, game) : null}
        {secondTitle ? <BlockHeader title={secondTitle.toUpperCase()} /> : null}
        <TouchableOpacityWithBlocker
          onPress={() => this.handlePress(feedUrl)}
          style={styles.touchable}
          activeOpacity={1}
        >
          <View style={styles.inner}>
            {status !== 'past' ? <FixtureTime {...{ status, game }} /> : null}
            <View style={styles.middleContainer}>
              {competition.length || metaText1.length ? (
                <View style={[styles.meta, styles.topMeta]}>
                  {competition ? (
                    <Text style={styles.metaTitle}>{competition}</Text>
                  ) : null}
                  {metaText1 ? (
                    <Text style={styles.metaText}>{metaText1}</Text>
                  ) : null}
                </View>
              ) : null}
              <View style={styles.body}>
                {this.getTeamName(game.home, homeScore, true)}
                {this.getBadge(homeLogo)}
                {this.getScore(homeScore, awayScore, status)}
                {this.getBadge(awayLogo)}
                {this.getTeamName(game.away, awayScore, false)}
              </View>
              {metaTitle2 || venue ? (
                <View style={[styles.meta, styles.bottomMeta]}>
                  {metaTitle2 ? (
                    <Text style={styles.metaTitle}>{metaTitle2}</Text>
                  ) : null}
                  {venue ? <Text style={styles.metaText}>{venue}</Text> : null}
                </View>
              ) : null}
            </View>
            {status !== 'past' ? <FixtureReminder {...{ gameId }} /> : null}
          </View>
        </TouchableOpacityWithBlocker>
      </View>
    );
  }
}

Fixture.propTypes = {
  game: PropTypes.object.isRequired,
  title: PropTypes.string,
  secondTitle: PropTypes.string,
  index: PropTypes.number
};
