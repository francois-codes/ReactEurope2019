import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 32
  },
  title: {
    color: '#a0aab4',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center'
  }
});

const TertiaryHeader = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

TertiaryHeader.propTypes = { title: PropTypes.string };

export default TertiaryHeader;
