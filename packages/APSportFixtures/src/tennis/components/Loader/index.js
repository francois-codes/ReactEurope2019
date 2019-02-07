import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Loader = props => (
  <View style={styles.container}>
    <ActivityIndicator color={props.color} />
  </View>
);

Loader.propTypes = {
  color: PropTypes.string
};

export default Loader;
