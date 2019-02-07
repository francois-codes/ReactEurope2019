import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { navigation } from 'react-native-zapp-bridge';
import { View, StyleSheet } from 'react-native';
import shortid from 'shortid';
import { zipObj, path } from 'ramda';

import { WidthClamp } from '@applicaster/london-rn-components';

import { groupData } from '../../../../helpers/filter';
import {
  SecondaryHeader,
  BlockHeader,
  Fixture,
  Empty,
  KonferenzeButton
} from '../../../index';
import { getSubTitle } from '../../../../helpers/content';
import { TABLET_CUTOFF } from '../../../../../const';
import { isGameLive } from '../../../../../util';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  inner: { maxWidth: '100%', marginBottom: 100, width: '100%' },
  wrapper: { marginHorizontal: 16 }
});

class SportLive extends PureComponent {
  getValues(values) {
    return zipObj(
      [
        'group',
        'championship',
        'round',
        'matchday',
        'groupMatchday',
        'konferenzeUrl'
      ],
      values
    );
  }

  openKonferenze(url) {
    const params = {
      bundle: 'APSportLiveMatch-RN',
      plugin: 'APSportLiveMatch',
      presentation: 'presentNoNavigation',
      'reactProps[dataUrl]': url
    };
    navigation.openInternalURL('ransports', params);
  }

  renderTitles(values) {
    const {
      group,
      championship,
      round,
      matchday,
      groupMatchday
    } = this.getValues(values);
    const subTitle = group.includes('inale')
      ? ''
      : getSubTitle(matchday, groupMatchday, round);
    const groupTitle = `${championship}${subTitle}`;
    const includeTitle = this.groupTitles.includes(groupTitle);

    if (includeTitle === false) {
      this.groupTitles.push(groupTitle);
    }

    return (
      <View key="header">
        {includeTitle === false ? (
          <SecondaryHeader {...{ title: championship, subTitle }} />
        ) : null}
        {group !== 'Spieltag' ? (
          <BlockHeader {...{ title: group, titleMargin: true }} />
        ) : null}
      </View>
    );
  }
  getKonferenzeButton(konferenzeUrl, matchList) {
    const numberOfLiveGames = matchList.reduce((acc, match) => {
      if (isGameLive(match)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (konferenzeUrl && numberOfLiveGames > 1) {
      return (
        <KonferenzeButton
          key="button"
          handlePress={() => this.openKonferenze(konferenzeUrl)}
        />
      );
    }
    return null;
  }

  renderGroup({ match, values, groupTitle }) {
    const { konferenzeUrl } = this.getValues(values);

    return (
      <View style={styles.wrapper} key={shortid.generate()}>
        <WidthClamp maxWidth={TABLET_CUTOFF}>
          {[
            this.renderTitles(values, groupTitle),
            ...match.map((game, index) => (
              <Fixture {...{ game, index }} key={game.id} />
            )),
            this.getKonferenzeButton(konferenzeUrl, match)
          ]}
        </WidthClamp>
      </View>
    );
  }

  render() {
    const { data } = this.props;
    this.groupTitles = [];
    const values = [
      ['round', 'name'],
      ['round', 'season', 'competition', 'name'],
      ['round', 'round_order'],
      ['matchday'],
      ['group_matchday'],
      ['conference', 'feedUrl']
    ];

    const groupBy = {
      property: item => {
        if (path(['round', 'name'], item) === 'Spieltag') {
          return ['round', 'season', 'competition', 'name'];
        }
        return ['round', 'name'];
      },
      type: 'string',
      prefix: ''
    };
    const filterBy = { property: ['match_date'], type: 'day', prefix: '' };
    const matchGroups = groupData(data, filterBy, groupBy, values);
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          {matchGroups.length ? (
            matchGroups.map(this.renderGroup.bind(this))
          ) : (
            <Empty text={'No live events on this day'} />
          )}
        </View>
      </View>
    );
  }
}

SportLive.propTypes = { data: PropTypes.array };

export default SportLive;
