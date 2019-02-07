/* eslint camelcase: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: { height: 24, marginVertical: 3, flexDirection: 'row' },
  flag: { width: 32, height: 24 },
  name: {
    lineHeight: 24,
    marginLeft: 10,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: 'rgb(58, 58, 72)'
  },
  scores: { flexDirection: 'row' },
  scoreContainer: { width: 26, justifyContent: 'center' },
  score: { lineHeight: 24, fontSize: 13, color: 'rgb(58, 58, 72)' },
  loser: { color: 'rgb(160, 170, 180)' }
});

const Player = ({ flagImgURI, winner, name, gameScores }) => (
  <View style={styles.container}>
    <Image
      source={flagImgURI ? { uri: flagImgURI } : null}
      style={styles.flag}
    />
    <Text style={[styles.name, winner ? null : styles.loser]}>{name}</Text>
    <View style={styles.scores}>
      {gameScores.map(({ match_result_at, match_result }) => (
        <View key={`game-${match_result_at}`} style={styles.scoreContainer}>
          <Text style={[styles.score, winner ? null : styles.looser]}>
            {match_result}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

Player.propTypes = {
  flagImgURI: PropTypes.string,
  winner: PropTypes.bool,
  name: PropTypes.string,
  gameScores: PropTypes.array
};

export default Player;
