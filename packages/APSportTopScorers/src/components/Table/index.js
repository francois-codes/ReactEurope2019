import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Header from './Header';
import Row from './Row';

const styles = StyleSheet.create({
  container: { justifyContent: 'flex-start', alignItems: 'flex-start' }
});

const Table = ({ titles, rows }) => (
  <View style={styles.container}>
    <Header {...{ titles }} />
    {rows.map(({ id, elems, onPress }) => (
      <Row key={id} {...{ data: elems, onPress }} />
    ))}
  </View>
);

Table.propTypes = { titles: PropTypes.array, rows: PropTypes.array };

export default Table;
