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
    color: '#A0AAB4',
    textAlign: 'center'
  },
  filterTextSelected: { color: '#1f5ae6' }
});

const FilterItem = ({ selectedOption, label, id, pressHandler, onLayout }) => (
  <TouchableOpacity
    onPress={pressHandler}
    style={styles.filterHighlight}
    underlayColor="#ffffff"
    onLayout={onLayout}
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
  onLayout: PropTypes.func
};

export default FilterItem;
