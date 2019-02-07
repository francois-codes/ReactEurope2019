import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

import { WidthClamp } from '@applicaster/london-rn-components';

import { TABLET_CUTOFF } from '../../../const';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    width: '100%',
    height: 47
  },
  title: { color: '#414954', fontSize: 13, fontWeight: 'bold' },
  wrapper: { marginHorizontal: 16 }
});

const PrimaryHeader = ({ title }) => (
  <View style={styles.container}>
    <View style={styles.wrapper}>
      <WidthClamp maxWidth={TABLET_CUTOFF}>
        <Text style={styles.title}>{title}</Text>
      </WidthClamp>
    </View>
  </View>
);

PrimaryHeader.propTypes = { title: PropTypes.string };

export default PrimaryHeader;
