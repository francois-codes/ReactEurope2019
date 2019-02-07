import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { responsiveMargin } from '../../helpers/responsive';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 18,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8'
  },
  inner: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16
  }
});

const Header = ({ titles }) => (
  <View style={styles.container}>
    <View style={[styles.inner, responsiveMargin()]}>{titles}</View>
  </View>
);

Header.propTypes = { titles: PropTypes.array };

export default Header;
