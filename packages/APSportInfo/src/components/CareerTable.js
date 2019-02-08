import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text } from 'react-native';
import moment from 'moment';

import Header from './Header';

import commonStyles from './common/styles';

const styles = {
  ...commonStyles,
  ...StyleSheet.create({
    badge: { height: 24, width: 24, marginHorizontal: 7 }
  })
};

const formatDate = dateStr => moment(dateStr, 'dd.mm.YYYY').format('mm/YYYY');

const formatDuration = (start, end) =>
  `${formatDate(start)}-${formatDate(end)}`;

const CareerTable = ({ jobs }) => (
  <View style={styles.section}>
    <Header>KARRIERE</Header>
    <View style={[styles.infoRow, styles.tableRow]}>
      <View style={{ width: 153 }}>
        <Text style={[styles.bodyText, styles.labelText]}>Zeitraum</Text>
      </View>
      <View style={styles.infoColumn}>
        <Text style={[styles.bodyText, styles.labelText]}>Name</Text>
      </View>
      <View style={{ width: 65 }}>
        <Text style={[styles.bodyText, styles.labelText, styles.centerText]}>
          Position
        </Text>
      </View>
    </View>
    {jobs.map(
      ({
        id,
        start,
        end,
        team: { name: team, image: teamImage },
        role: { name: role }
      }) => (
        <View style={[styles.infoRow, styles.tableRow]} key={id}>
          <View style={{ width: 115 }}>
            <Text style={styles.bodyText}>{formatDuration(start, end)}</Text>
          </View>
          <Image style={styles.badge} source={{ uri: teamImage }} />
          <View style={styles.infoColumn}>
            <Text style={styles.bodyText}>{team}</Text>
          </View>
          <View style={{ width: 65 }}>
            <Text style={[styles.bodyText, styles.centerText]}>{role}</Text>
          </View>
        </View>
      )
    )}
  </View>
);

CareerTable.propTypes = { jobs: PropTypes.array };

export default CareerTable;
