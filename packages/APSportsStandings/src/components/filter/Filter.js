import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { length } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { setPrimaryFilterOption as setPrimaryFilterOptionAction } from '../../actions';
import FilterItem from './FilterItem';

import assets from '../../../assets/map.json';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 54,
    backgroundColor: '#ffffff',
    shadowColor: '#00000019',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 1,
    shadowOpacity: 1
  },
  scrollContainer: { alignSelf: 'stretch', minWidth: '100%' },
  filterRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    flex: 1
  },
  gradientOverlay: { zIndex: 1, position: 'absolute' },
  gradientOverlayLeft: { left: 0 },
  gradientOverlayRight: { right: 0 }
});

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedX: 0, selectedWidth: 0 };
  }

  handlePress(event, { id }) {
    this.props.setPrimaryFilterOption({ primarySelectedOption: id });
  }

  getXofSelectedItem(event, selectedOption, id) {
    const { selectedX } = this.state;
    const xPos = event.nativeEvent.layout.x;
    const itemWidth = event.nativeEvent.layout.width;

    if (selectedOption === id && xPos !== selectedX) {
      this.setState({
        selectedX: event.nativeEvent.layout.x,
        selectedWidth: itemWidth
      });
    }
  }

  getWidthOffet() {
    const { selectedX, selectedWidth } = this.state;
    const halfDeviceWidth = Dimensions.get('window').width / 2;

    if (selectedWidth > 0) {
      const halfSelectedWidth = selectedWidth / 2;
      const offset = halfDeviceWidth + halfSelectedWidth;
      return selectedX - offset;
    }
    return 0;
  }

  getFilterPadding() {
    const { selectedWidth } = this.state;
    const halfDeviceWidth = Dimensions.get('window').width / 2;

    if (selectedWidth > 0) {
      const halfSelectedWidth = selectedWidth / 2;
      return { paddingRight: halfDeviceWidth - halfSelectedWidth };
    }
    return null;
  }

  render() {
    const { filterOptions, selectedOption } = this.props;
    const filterX = this.getWidthOffet();
    const filterPadding = this.getFilterPadding();
    if (length(filterOptions) < 2) return null;
    return (
      <View style={styles.container}>
        <Image
          style={[styles.gradientOverlay, styles.gradientOverlayLeft]}
          source={assets.filterGradientLeft}
        />
        <ScrollView
          contentOffset={{ x: filterX, y: 0 }}
          contentContainerStyle={styles.scrollContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.filterRow, filterPadding]}>
            {filterOptions.map(option => {
              const { id } = option;
              return (
                <FilterItem
                  {...{ selectedOption, ...option }}
                  getPosition={event =>
                    this.getXofSelectedItem(event, selectedOption, id)
                  }
                  key={id}
                  pressHandler={event => this.handlePress(event, option)}
                />
              );
            })}
          </View>
        </ScrollView>
        <Image
          style={[styles.gradientOverlay, styles.gradientOverlayRight]}
          source={assets.filterGradientRight}
        />
      </View>
    );
  }
}

Filter.propTypes = {
  setPrimaryFilterOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
  filterOptions: PropTypes.array.isRequired,
  defaultFilterOption: PropTypes.object
};

const mapStateToProps = state => ({
  selectedOption: state.filter.primarySelectedOption
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setPrimaryFilterOption: setPrimaryFilterOptionAction },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
