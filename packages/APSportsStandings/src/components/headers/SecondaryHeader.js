import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 48
  },
  title: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  subTitle: { color: '#a0aab4' }
});

const SecondaryHeader = ({ title, subTitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>
      {title}{' '}
      <Text style={styles.subTitle}>
        {subTitle ? <Text>{' · '}</Text> : null}
        {subTitle}
      </Text>
    </Text>
  </View>
);

SecondaryHeader.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string
};

export default SecondaryHeader;
