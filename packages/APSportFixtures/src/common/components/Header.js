import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { WidthClamp } from '@applicaster/london-rn-components';

import { TABLET_CUTOFF } from '../../const';

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'rgb(232, 232, 232)',
    paddingHorizontal: 16
  },
  headerText: {
    lineHeight: 16,
    fontSize: 13,
    fontWeight: 'bold',
    paddingVertical: 16,
    color: 'black'
  }
});

const Header = ({ children }) => (
  <View style={styles.header}>
    <WidthClamp maxWidth={TABLET_CUTOFF}>
      <Text style={styles.headerText}>{children.toUpperCase()}</Text>
    </WidthClamp>
  </View>
);

Header.propTypes = { children: PropTypes.node };

export default Header;
