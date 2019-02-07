/* eslint camelcase: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { navigation } from 'react-native-zapp-bridge';
import {
  WidthClamp,
  withSwipeTapBlocker
} from '@applicaster/london-rn-components';

import Player from './Player';

import { TABLET_CUTOFF } from '../../../const';

const TouchableOpacityWithBlocker = withSwipeTapBlocker(TouchableOpacity);

const styles = StyleSheet.create({
  outerWrapper: { marginHorizontal: 16 },
  wrapper: {
    backgroundColor: 'white',
    marginVertical: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flex: 1
  },
  incident: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 16,
    color: 'rgb(73, 73, 74)'
  }
});

const handlePress = feedUrl => {
  navigation.openInternalURL('ransports', {
    bundle: 'APSportLiveMatch-RN',
    plugin: 'APSportLiveMatch',
    presentation: 'presentNoNavigation',
    'reactProps[dataUrl]': feedUrl
  });
};

const Match = ({
  data: { home, away, match_result, winner_team, match_incident, feedUrl },
  tapThreshold
}) => (
  <View style={styles.outerWrapper}>
    <WidthClamp maxWidth={TABLET_CUTOFF}>
      <TouchableOpacityWithBlocker
        {...{ tapThreshold }}
        activeOpacity={1}
        onPress={() => {
          handlePress(feedUrl);
        }}
      >
        <View style={styles.wrapper}>
          <Player
            flagImgURI={home.country ? home.country.image : null}
            winner={winner_team ? home.id === winner_team.id : true}
            name={home.name}
            gameScores={match_result
              .filter(gameScore => gameScore.place === 'none_home')
              .slice(1)}
          />
          <Player
            flagImgURI={away.country ? away.country.image : null}
            winner={winner_team ? away.id === winner_team.id : true}
            name={away.name}
            gameScores={match_result
              .filter(gameScore => gameScore.place === 'none_away')
              .slice(1)}
          />
        </View>
      </TouchableOpacityWithBlocker>
    </WidthClamp>
    {match_incident ? (
      <Text style={styles.incident}>{match_incident.shortname}</Text>
    ) : null}
  </View>
);

Match.getHeight = data => 90 + (data.match_incident ? 28 : 0);

Match.propTypes = {
  data: PropTypes.object,
  tapThreshold: PropTypes.number
};

export default Match;
