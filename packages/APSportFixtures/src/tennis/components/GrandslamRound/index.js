/* eslint no-confusing-arrow: 0, indent: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { convertToLocalTime } from '../../../util';

import Match from './Match';

const styles = StyleSheet.create({
  wrapper: {
    flex: 0,
    width: '100%',
    backgroundColor: 'rgb(246, 246, 248)'
  },
  date: {
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 16,
    paddingBottom: 15,
    paddingTop: 20,
    paddingHorizontal: 16,
    color: 'rgb(51, 51, 51)'
  },
  dateWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(232, 232, 232)',
    marginBottom: 24
  },
  time: {
    textAlign: 'center',
    color: 'rgb(160, 170, 180)',
    paddingVertical: 8
  },
  fullScreen: { flex: 1 },
  gamesList: {
    paddingBottom: 54
  }
});

const getDateHeader = (date, hide) =>
  hide
    ? []
    : [
        {
          height: 76,
          node: (
            <View style={styles.dateWrapper}>
              <Text style={styles.date}>{date.format('dddd, DD.MM.YYYY')}</Text>
            </View>
          )
        }
      ];

const GrandslamRound = ({ data: days, isFullScreen, hideDates }) => {
  const rows = days.reduce(
    (accumulator, { date, times }) => [
      ...accumulator,
      ...[
        ...getDateHeader(date, hideDates),
        ...times.reduce(
          (a, time) => [
            ...a,
            {
              height: 33,
              node: (
                <Text style={styles.time}>
                  {convertToLocalTime(time.time)} Uhr
                </Text>
              )
            },
            ...time.matches.map(match => ({
              height: Match.getHeight(match),
              node: <Match key={match.id} data={match} />
            }))
          ],
          []
        )
      ]
    ],
    []
  );

  const getItemLayout = (data, index) => ({
    length: data[index].height,
    offset:
      index === 0
        ? 0
        : rows.slice(0, index).reduce((a, { height }) => a + height, 0),
    index
  });

  const cellStyle = { height: rows.reduce((acc, row) => acc + row.height, 0) };

  return (
    <View
      style={[styles.wrapper, isFullScreen ? styles.fullScreen : cellStyle]}
    >
      <FlatList
        contentContainerStyle={styles.gamesList}
        data={rows}
        scrollEnabled={isFullScreen}
        keyExtractor={(day, i) => `row-${i}`}
        renderItem={({ item }) => item.node}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

GrandslamRound.propTypes = {
  data: PropTypes.array,
  isFullScreen: PropTypes.bool,
  hideDates: PropTypes.bool
};

GrandslamRound.defaultProps = { isFullScreen: false, hideDates: false };

export default GrandslamRound;
