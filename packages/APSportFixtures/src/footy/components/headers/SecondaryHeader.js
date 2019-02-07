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
    color: '#414954',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  subTitle: { color: '#a0aab4' }
});

const SecondaryHeader = ({ title, subTitle, titleMargin }) => (
  <View style={[styles.container, titleMargin ? { marginTop: 16 } : null]}>
    <Text style={styles.title}>
      {title}
      {subTitle ? (
        <Text style={styles.subTitle}>
          <Text>{' · '}</Text>
          {subTitle}
        </Text>
      ) : null}
    </Text>
  </View>
);

SecondaryHeader.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  titleMargin: PropTypes.bool
};

export default SecondaryHeader;
