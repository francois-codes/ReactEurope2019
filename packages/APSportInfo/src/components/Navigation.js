import React from 'react';
import { View, StyleSheet } from 'react-native';
import Close from './Close';

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    height: 44,
    backgroundColor: '#1f5ae6'
  }
});

const Navigation = () => (
  <View style={styles.container}>
    <Close />
  </View>
);

export default Navigation;
