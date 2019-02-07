import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import R from 'ramda';

import GrandslamRound from '../GrandslamRound';
import Empty from '../Empty';

const styles = StyleSheet.create({
  wrapper: { backgroundColor: 'rgb(246, 246, 248)' },
  roundText: {
    color: 'rgb(160, 170, 180)',
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold'
  },
  compText: { color: 'rgb(51, 51, 51)' }
});

const RoundList = ({ competitions }) => (
  <View style={styles.wrapper}>
    {competitions.length ? (
      R.map(({ rounds, competitionName }) =>
        R.map(({ matches, roundName }) => (
          <View key={roundName}>
            <Text style={styles.roundText}>
              <Text style={styles.compText}>{competitionName || 'N/A'}</Text> ·{' '}
              {roundName}
            </Text>
            <GrandslamRound data={matches} hideDates />
          </View>
        ))(rounds)
      )(competitions)
    ) : (
      <Empty>Aktuell finden keine Live-Events statt.</Empty>
    )}
  </View>
);

RoundList.propTypes = { competitions: PropTypes.array.isRequired };

export default RoundList;
