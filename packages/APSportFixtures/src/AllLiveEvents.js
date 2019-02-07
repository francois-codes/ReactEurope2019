/* eslint no-confusing-arrow: 0, indent: 0 */
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import R from 'ramda';
import { AsyncContent } from '@applicaster/london-rn-components';
import { isGameLive, getMatchMinute } from './util';

import { ERROR_MESSAGES } from './const';

import { groupByRoundsAndCompetitions } from './tennis/api';

import {
  groupRoundsBySportCategory,
  findCompetitionForEachMatch
} from './motorsports/api';

import TennisScreen from './tennis/components/RoundList';
import MotorsportsApp from './motorsports/components/Categories';
import FootyScreen from './footy/Screen';

import Header from './common/components/Header';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f8',
    width: Dimensions.get('window').width,
    flex: 0
  }
});

const getAllLiveEvents = async dataUrl => {
  const {
    data: { response }
  } = await axios.get(dataUrl, { timeout: 30000 });

  if (response) {
    return response;
  }
  throw Error('No data');
};

const groupMatchesBySport = R.compose(
  R.map(([sport, matches]) => ({ sport, matches })),
  R.toPairs,
  R.groupBy(R.prop('sport'))
);

const EventsList = ({ sports, appContext }) => (
  <View>
    {sports.map(({ sport, matches }) => {
      if (sport === 'fussball' || sport === 'us-sport') {
        return (
          <View key={sport}>
            <Header>{sport === 'fussball' ? 'FUSSBALL' : 'NFL'}</Header>
            <FootyScreen
              data={matches}
              sport="fussball"
              appContext={appContext}
            />
          </View>
        );
      }

      if (sport === 'tennis') {
        return (
          <View key={sport}>
            <Header>Tennis</Header>
            <TennisScreen
              competitions={groupByRoundsAndCompetitions(matches)}
            />
          </View>
        );
      }

      if (sport === 'motorsport') {
        return (
          <MotorsportsApp
            key={sport}
            data={groupRoundsBySportCategory(
              findCompetitionForEachMatch(matches)
            )}
            alwaysShowCategoryTitle
            singleDay
          />
        );
      }

      return null;
    })}
  </View>
);

EventsList.propTypes = {
  sports: PropTypes.array,
  appContext: PropTypes.string
};

class AllLiveEvents extends PureComponent {
  constructor(props) {
    super(props);
    this.pullData = this.pullData.bind(this);
  }
  getLiveMatchData(matches) {
    const supportedSports = ['fussball', 'us-sport'];
    const isSportSupported = R.propSatisfies(
      R.contains(R.__, supportedSports), // eslint-disable-line no-underscore-dangle
      'sport'
    );

    return Promise.all(
      R.map(
        R.ifElse(
          R.allPass([isGameLive, isSportSupported]),
          getMatchMinute,
          Promise.resolve
        )
      )(matches)
    );
  }
  pullData() {
    return getAllLiveEvents(this.props.dataUrl)
      .then(this.getLiveMatchData)
      .then(groupMatchesBySport)
      .then(sports => ({ sports }));
  }
  render() {
    const { appContext } = this.props;
    return (
      <View style={styles.container}>
        <AsyncContent
          dataFetcher={this.pullData}
          errorMessageText={ERROR_MESSAGES.network}
        >
          <EventsList {...{ appContext }} />
        </AsyncContent>
      </View>
    );
  }
}

AllLiveEvents.propTypes = {
  dataUrl: PropTypes.string,
  appContext: PropTypes.string
};

export default AllLiveEvents;
