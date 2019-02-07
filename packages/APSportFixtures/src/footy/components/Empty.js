import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100
  },
  bodyText: {
    // fontFamily: 'SFUIText',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: -0.34,
    textAlign: 'center',
    color: '#a0aab4'
  }
});

const Empty = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.bodyText}>{text}</Text>
  </View>
);

Empty.propTypes = { text: PropTypes.string };

export default Empty;
