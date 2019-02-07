import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
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

const SecondaryHeader = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

SecondaryHeader.propTypes = { title: PropTypes.string };

export default SecondaryHeader;
