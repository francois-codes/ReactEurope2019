import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';
import { compose } from 'ramda';
import Table from '../Table';
import { isTablet } from '../../helpers/responsive';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { justifyContent: 'center', alignItems: 'flex-start' },
  text: {
    fontSize: 12,
    fontWeight: '800',
    fontStyle: 'normal',
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#3a3a48'
  },
  bodyText: { fontWeight: '800' },
  titleText: { lineHeight: 18, textAlign: 'center', color: '#a0aab4' },
  image: { width: 30, height: 40 },
  imageWrapper: {
    overflow: 'hidden',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  flagImage: { width: 24, height: 18 },
  cell0: { width: isTablet() ? 80 : 64 },
  cell1: { flex: 1 },
  cell2: { width: 60, alignItems: 'center' },
  cell3: { width: 60, alignItems: 'center' }
});

const titleStrs = ['#', 'SPIELER', 'LAND', 'PUNKTE'];

export default class TennisList extends PureComponent {
  getTitles() {
    return titleStrs.map(title => (
      <Text key={title} style={[styles.text, styles.titleText]}>
        {title}
      </Text>
    ));
  }

  getCellContents({
    points,
    rank,
    person: { name, image, country: [{ image: flag }] } = { country: [{}] }
  }) {
    return [
      <View key="avatar" style={styles.row}>
        <Text style={[styles.text, styles.bodyText, { flex: 1 }]}>{rank}</Text>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      </View>,
      <View key="name">
        <Text style={[styles.text, styles.bodyText]}>{name}</Text>
      </View>,
      <Image key="flag" source={{ uri: flag }} style={styles.flagImage} />,
      <Text key="points" style={[styles.text, styles.bodyText]}>
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
    const titles = compose(
      this.getCells,
      this.getTitles
    )();
    const rows = this.getRows(this.props.data);
    return <Table {...{ titles, rows }} />;
  }
}

TennisList.propTypes = { data: PropTypes.array };
