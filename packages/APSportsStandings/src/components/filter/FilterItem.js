import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  filterHighlight: {
    paddingHorizontal: 20,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#a0aab4',
    textAlign: 'center'
  },
  filterTextSelected: { color: '#1f5ae6' }
});

const FilterItem = ({
  selectedOption,
  label,
  id,
  pressHandler,
  getPosition
}) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={pressHandler}
    style={styles.filterHighlight}
    underlayColor={'#ffffff'}
    onLayout={getPosition}
  >
    <Text
      style={
        selectedOption === id
          ? [styles.filterText, styles.filterTextSelected]
          : styles.filterText
      }
    >
      {label}
    </Text>
  </TouchableOpacity>
);

FilterItem.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  selectedOption: PropTypes.string,
  pressHandler: PropTypes.func,
  getPosition: PropTypes.func
};

export default FilterItem;
