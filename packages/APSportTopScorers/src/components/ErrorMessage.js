import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  errorContainer: {
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 50
  },
  errorMessage: { color: '#a0aab4', textAlign: 'center' }
});

const ErrorMessage = ({ children }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorMessage}>{children}</Text>
  </View>
);

ErrorMessage.propTypes = { children: PropTypes.node };

export default ErrorMessage;
