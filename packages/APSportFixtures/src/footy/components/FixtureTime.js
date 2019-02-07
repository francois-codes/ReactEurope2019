import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';
import { convertToLocalTime } from '../../util';
import colors from '../styles/colors';

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingLeft: 6,
    paddingRight: 0,
    maxWidth: 50,
    minWidth: 30,
    borderColor: '#ffffff'
  },
  text: { fontWeight: '600', fontSize: 11 },
  pastContainer: { borderColor: colors.past },
  liveContainer: { borderColor: colors.present },
  futureContainer: { borderColor: colors.future },
  pastText: { color: colors.past },
  liveText: { color: colors.present },
  futureText: { color: colors.future }
});

export default class FixtureTime extends PureComponent {
  getFutureDateText(dateStr, textColor) {
    const date = moment(dateStr, 'DD.MM.YYYY');
    const day = date.format('dd');
    const formattedDate = date.format('DD.MM');
    return (
      <View>
        <Text style={[styles.text, textColor]}>{day}</Text>
        <Text style={[styles.text, textColor]}>{formattedDate}</Text>
      </View>
    );
  }

  getTimeText(matchTime, textColor, isLive) {
    const time = matchTime === 'unknown' ? '00:00' : matchTime;
    return (
      <Text style={[styles.text, textColor]}>
        {time}
        {isLive && "'"}
      </Text>
    );
  }

  isToday(dateStr) {
    const today = moment();
    const gameDay = moment(dateStr, 'DD.MM.YYYY');
    const diff = today.diff(gameDay, 'days');

    return diff === 0 ? 1 : 0;
  }

  getTime(status, game) {
    const { match_time: matchTime, current_minute: currentMinute } = game;
    const textColor = styles[`${status}Text`];
    if (status === 'future') {
      return this.getTimeText(convertToLocalTime(matchTime), textColor);
    }
    // need to get live duration
    return this.getTimeText(currentMinute || '0', textColor, true);
  }

  render() {
    const {
      status,
      game,
      game: { match_time: matchTime }
    } = this.props;
    if (matchTime === 'unknown') return <View style={styles.container} />;

    const timeText = this.getTime(status, game);
    const containerColor = styles[`${status}Container`];
    return <View style={[styles.container, containerColor]}>{timeText}</View>;
  }
}

FixtureTime.propTypes = { status: PropTypes.string, game: PropTypes.object };
