import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

import commonStyles from './common/styles';

const styles = {
  ...commonStyles,
  ...StyleSheet.create({
    headerRow: { paddingHorizontal: 16, marginBottom: 16 },
    headerText: {
      fontSize: 13,
      lineHeight: 16,
      color: 'black',
      fontWeight: 'bold'
    }
  })
};

const Header = ({ children }) => (
  <View style={[styles.infoRow, styles.headerRow]}>
    <Text style={styles.headerText}>{children}</Text>
  </View>
);

Header.propTypes = {
  children: PropTypes.node
};

export default Header;
