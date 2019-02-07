/* eslint no-confusing-arrow: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withSwipeTapBlocker } from '@applicaster/london-rn-components';

import { responsiveMargin } from '../../helpers/responsive';

const styles = StyleSheet.create({
  button: { width: '100%' },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 7,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8'
  }
});

const TouchableOpacityWithBlocker = withSwipeTapBlocker(TouchableOpacity);

const Content = ({ children }) => (
  <View style={[styles.container, responsiveMargin()]}>{children}</View>
);

Content.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

const Row = ({ data, onPress }) =>
  onPress ? (
    <TouchableOpacityWithBlocker
      {...{ onPress }}
      style={styles.button}
      activeOpacity={1}
    >
      <Content>{data}</Content>
    </TouchableOpacityWithBlocker>
  ) : (
    <Content>{data}</Content>
  );

Row.propTypes = { data: PropTypes.array.isRequired, onPress: PropTypes.func };

export default Row;
