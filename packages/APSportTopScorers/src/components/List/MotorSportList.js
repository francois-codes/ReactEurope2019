import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';
import { compose, prop, head, has, not } from 'ramda';
import Table from '../Table';
import { isTablet } from '../../helpers/responsive';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { justifyContent: 'center' },
  bodyText: {
    fontSize: 12,
    fontWeight: '800',
    fontStyle: 'normal',
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#3a3a48'
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#a0aab4'
  },
  titleText: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#a0aab4'
  },
  image: { width: 30, height: 40 },
  imageWrapper: {
    overflow: 'hidden',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  teamImage: { width: 30, height: 30, marginRight: 10 },
  flagImage: { width: 24, height: 18 },
  cell0: { width: isTablet() ? 80 : 64, alignItems: 'flex-start' },
  cell1: { flex: 1, alignItems: 'flex-start' },
  cell2: { width: 60, alignItems: 'center' },
  cell3: { width: 60, alignItems: 'center' }
});

export default class MotorSportList extends Component {
  getTitles(isTeam) {
    const nameTitle = isTeam ? 'TEAM' : 'FAHRER';
    return ['#', nameTitle, 'LAND', 'PUNKTE'].map(title => (
      <Text key={title} style={styles.titleText}>
        {title}
      </Text>
    ));
  }

  getProps(data) {
    const { rank, points } = data;
    if (prop('person', data)) {
      const {
        team: { name: meta },
        person: {
          firstname,
          surname,
          image,
          country: { image: flag }
        }
      } = data;
      const name = `${firstname} ${surname}`;
      return { rank, points, flag, meta, name, image, isTeam: false };
    }
    const {
      team: {
        name,
        image,
        country: { image: flag }
      }
    } = data;

    return { rank, points, flag, meta: '', name, image, isTeam: true };
  }

  renderImage(image, isTeam) {
    return isTeam ? (
      <Image source={{ uri: image }} style={styles.teamImage} />
    ) : (
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
    );
  }

  getCellContents(data) {
    const { rank, points, flag, meta, name, image, isTeam } = this.getProps(
      data
    );
    return [
      <View key="image" style={styles.row}>
        <Text style={[styles.bodyText, { flex: 1 }]}>{rank}</Text>
        {this.renderImage(image, isTeam)}
      </View>,
      <View key="meta">
        <Text style={styles.bodyText}>{`${name}`}</Text>
        {meta ? <Text style={styles.metaText}>{meta}</Text> : null}
      </View>,
      <Image key="flag" source={{ uri: flag }} style={styles.flagImage} />,
      <Text key="points" style={styles.bodyText}>
        {points}
      </Text>
    ];
  }

  getCells(data) {
    return data.map((item, index) => (
      <View key={item.key} style={[styles.cell, styles[`cell${index}`]]}>
        {item}
      </View>
    ));
  }

  getRows(data) {
    return data.map(item => ({
      id: item.id,
      elems: this.getCells(this.getCellContents(item))
    }));
  }

  render() {
    const { data } = this.props;
    const isTeam = compose(
      not,
      has('person'),
      head
    )(data);
    const titles = compose(
      this.getCells,
      this.getTitles
    )(isTeam);
    const rows = this.getRows(data);
    return <Table {...{ titles, rows }} />;
  }
}

MotorSportList.propTypes = { data: PropTypes.array };
