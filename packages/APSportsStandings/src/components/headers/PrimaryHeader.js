import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingLeft: 16,
    width: '100%',
    height: 47
  },
  title: { color: '#333333', fontSize: 13, fontWeight: 'bold' }
});

const PrimaryHeader = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

PrimaryHeader.propTypes = {
  title: PropTypes.string
};

export default PrimaryHeader;
