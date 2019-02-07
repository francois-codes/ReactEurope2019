import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';
import { compose, prop, sortBy, reverse } from 'ramda';
import { navigation } from 'react-native-zapp-bridge';

import Table from '../Table';
import { isTablet } from '../../helpers/responsive';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { justifyContent: 'center' },
  bodyText: {
    fontSize: 12,
    fontWeight: '800',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333'
  },
  metaText: {
    fontSize: 10,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333'
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
  image: { width: 31, height: 40 },
  imageWrapper: {
    overflow: 'hidden',
    width: 31,
    height: 31,
    borderRadius: 16,
    marginRight: 10
  },
  cell0: { width: isTablet() ? 80 : 70, alignItems: 'flex-start' },
  cell1: { flex: 1, alignItems: 'flex-start' },
  cell2: { width: 60, alignItems: 'flex-end' }
});

export default class FussballList extends Component {
  getTitles() {
    return ['#', 'SPIELER', 'TORE'].map(title => (
      <Text key={title} style={styles.titleText}>
        {title}
      </Text>
    ));
  }

  renderImage(image) {
    return (
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
    );
  }

  getCellContents(data, index) {
    const {
      score,
      person: { name, image },
      team: { name: teamName }
    } = data;

    return [
      <View key="avatar" style={styles.row}>
        <Text style={[styles.bodyText, { flex: 1, fontWeight: '500' }]}>
          {index + 1}
        </Text>
        {this.renderImage(image)}
      </View>,
      <View key="info">
        <Text style={styles.bodyText}>{`${name}`}</Text>
        <Text style={styles.metaText}>{teamName}</Text>
      </View>,
      <Text key="score" style={styles.bodyText}>
        {score}
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
    return data.map((item, index) => ({
      id: item.id,
      onPress: () => {
        navigation.openInternalURL('ransports', {
          bundle: 'APSportInfo-RN',
          plugin: 'Info-fullscreen',
          presentation: 'presentNoNavigation',
          'reactProps[dataUrl]': item.person.feedUrl
        });
      },
      elems: this.getCells(this.getCellContents(item, index))
    }));
  }

  render() {
    const { data } = this.props;
    const sortPlayers = sortBy(
      compose(
        parseInt,
        prop('score')
      )
    );
    const sortedPlayers = reverse(sortPlayers(data));

    const titles = compose(
      this.getCells,
      this.getTitles
    )();
    const rows = this.getRows(sortedPlayers);

    return <Table {...{ titles, rows }} />;
  }
}

FussballList.propTypes = { data: PropTypes.array };
