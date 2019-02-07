import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Image } from 'react-native';
import { mergeDeepRight, prop, inc, path } from 'ramda';

import {
  isCompact,
  responsiveMargin,
  isTablet
} from '../../helpers/responsive';

import assets from '../../../assets/map.json';

const baseStyles = {
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(0,0,0,0)'
  },
  inner: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    height: 52,
    alignItems: 'center'
  },
  indicator: { width: 10, height: 10 },
  teamBadge: { width: 22, height: 22, marginRight: 6, marginLeft: 9 },
  bodyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A0AAB4',
    textAlign: 'center',
    minWidth: 20
  },
  darkText: { color: '#414954' },
  edgeText: { minWidth: 18, textAlign: 'left' },
  labelColumn: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '44%',
    paddingLeft: 12
  },
  dataColumn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '56%',
    paddingRight: 16
  }
};

const tabletStyles = {
  labelColumn: { width: '77%' },
  dataColumn: { width: '23%' }
};

const styles = StyleSheet.create(
  isTablet() ? mergeDeepRight(baseStyles, tabletStyles) : baseStyles
);

export default class Standing extends Component {
  getBadge(image) {
    return isCompact() ? null : (
      <Image source={{ uri: image }} style={styles.teamBadge} />
    );
  }

  getIndicator(rank, lastRank) {
    if (rank === '' || lastRank === '') {
      return null;
    }

    let source = assets.stay;

    if (rank > lastRank) {
      source = assets.up;
    } else if (rank < lastRank) {
      source = assets.down;
    }

    return <Image {...{ source }} style={styles.indicator} />;
  }

  renderData(
    { matches, draw, lost, difference, percentage = 0, points, win },
    sport
  ) {
    if (sport === 'us-sport') {
      return (
        <View style={styles.dataColumn}>
          {[matches, win, draw, lost].map((text, i) => (
            <Text style={[styles.bodyText]} key={i}>
              {text}
            </Text>
          ))}
          <Text style={[styles.bodyText, styles.darkText]}>
            {Math.round(percentage * 100)}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.dataColumn}>
        {[matches, win, draw, lost, difference].map((text, i) => (
          <Text style={styles.bodyText} key={i}>
            {text}
          </Text>
        ))}
        <Text style={[styles.bodyText, styles.darkText]}>{points}</Text>
      </View>
    );
  }

  getColourFromID(id) {
    // 1: Champions League
    // 2: Europa League
    // 3: Europa League Quali.
    // 6: Relegation
    // 8: Abstieg
    const colours = {
      1: '#10335E',
      2: '#416286',
      3: '#92A6BB',
      4: '',
      6: '#F59C07',
      7: '',
      8: '#D90015'
    };
    const borderLeftColor = prop(id, colours);
    return borderLeftColor ? { borderLeftColor } : null;
  }

  getColourID(roundMarker, index) {
    const nonZeroedIndex = inc(index);
    return roundMarker.reduce((acc, val) => {
      const { colour_id: colourID, from, to } = val;
      if (
        nonZeroedIndex >= parseInt(from, 10) &&
        nonZeroedIndex <= parseInt(to, 10)
      ) {
        return colourID;
      }
      return acc;
    }, 0);
  }

  render() {
    // played, wins, draws, losses, diff, points
    const {
      sport,
      index,
      data,
      data: { team: { shortname, image } = {}, rank, last_rank } // eslint-disable-line camelcase
    } = this.props;

    const roundMarker = path(['meta', 'round_marker'], data);

    const colourID = roundMarker && this.getColourID(roundMarker, index);
    const borderStyle =
      sport === 'us-sport' ? null : this.getColourFromID(colourID);

    return (
      <View style={[styles.container, borderStyle, responsiveMargin()]}>
        <View style={styles.inner}>
          <View style={styles.labelColumn}>
            <Text style={[styles.bodyText, styles.darkText, styles.edgeText]}>
              {index + 1}
            </Text>
            {this.getIndicator(rank, last_rank)}
            {this.getBadge(image)}
            <Text style={[styles.bodyText, styles.darkText]}>{shortname}</Text>
          </View>
          {this.renderData(data, sport)}
        </View>
      </View>
    );
  }
}

Standing.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  sport: PropTypes.string
};
