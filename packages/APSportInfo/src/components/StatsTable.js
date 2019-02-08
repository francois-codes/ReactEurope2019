/* eslint no-confusing-arrow: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import Header from './Header';

import styles from './common/styles';

const statLabels = [
  { key: 'playing', label: 'Spiele' },
  { key: 'score', label: 'Tore' },
  { key: 'score_penalty', label: 'Elfmeter Tore' },
  { key: 'scorerpoints', label: 'Scorer Points' },
  { key: 'assists', label: 'Assists' }
];

const StatsTable = ({ stats }) =>
  (filteredStats =>
    filteredStats.length ? (
      <View style={styles.section}>
        <Header>SAISONSTATISTIK</Header>
        {statLabels.map(({ key, label }) => (
          <View style={[styles.infoRow, styles.tableRow]} key={key}>
            <View style={styles.infoColumn}>
              <Text style={styles.bodyText}>{label}</Text>
            </View>
            <View style={{ width: 76 }}>
              <Text style={[styles.bodyText, styles.centerText]}>
                {stats[key]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    ) : null)(Object.keys(stats).filter(key => stats[key]));

StatsTable.propTypes = {
  stats: PropTypes.object
};

export default StatsTable;
