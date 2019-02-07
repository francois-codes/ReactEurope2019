import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: '100%',
    backgroundColor: '#ffffff',
    marginBottom: 0
  },
  title: {
    color: '#a0aab4',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600'
  }
});

const BlockHeader = ({ title, titleMargin }) => (
  <View style={[styles.container, titleMargin ? { marginTop: 16 } : null]}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

BlockHeader.propTypes = {
  title: PropTypes.string,
  titleMargin: PropTypes.bool
};

export default BlockHeader;
