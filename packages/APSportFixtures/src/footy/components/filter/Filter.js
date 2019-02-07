import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { prop } from 'ramda';
import { View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';

import FilterItem from './FilterItem';
import assets from '../../assets/map.json';

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 5,
    flex: 1
  },
  gradientOverlay: { zIndex: 1, position: 'absolute' },
  gradientOverlayLeft: { left: 0 },
  gradientOverlayRight: { right: 0 }
});

export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = { paddingLeft: 0, paddingRight: 0, selectedOffset: 0 };

    this.optionWidths = [];
    this.onLayoutCount = 0;
    this.initialScroll = true;
  }

  handlePress(primarySelectedOption) {
    this.props.setFilterOption({ primarySelectedOption });
  }

  collectOptionWidth(index, width) {
    const { filterOptions } = this.props;

    this.optionWidths[index] = width;
    this.onLayoutCount += 1;

    // once we have collected all tab widths we can do out initial layout
    if (this.onLayoutCount === filterOptions.length) {
      this.doInitialLayout();
    }
  }

  getSelectedOffset() {
    const { filterOptions, selectedOption } = this.props;

    const selectedIndex = filterOptions.findIndex(
      ({ id }) => id === selectedOption
    );

    const widthDiff = this.optionWidths[0] - this.optionWidths[selectedIndex];
    const offsetDiff = widthDiff / 2;

    return (
      this.optionWidths.reduce(
        (acc, width, index) => (index < selectedIndex ? acc + width : acc),
        0
      ) - offsetDiff
    );
  }

  doInitialLayout() {
    const { filterOptions } = this.props;
    const screenWidth = Dimensions.get('window').width;

    const firstOptWidth = this.optionWidths[0];
    const lastOptWidth = this.optionWidths[filterOptions.length - 1];

    const paddingLeft = (screenWidth - firstOptWidth) / 2;
    const paddingRight = (screenWidth - lastOptWidth) / 2;

    const selectedOffset = this.getSelectedOffset();

    if (
      paddingLeft !== this.state.paddingLeft ||
      paddingRight !== this.state.paddingRight ||
      selectedOffset !== this.state.selectedOffset
    ) {
      this.setState({ paddingLeft, paddingRight, selectedOffset });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.selectedOption !== prevProps.selectedOption &&
      !this.initialScroll
    ) {
      this.setState({ selectedOffset: this.getSelectedOffset() });
    }

    if (this.state.selectedOffset !== prevState.selectedOffset) {
      setTimeout(() => {
        this.scrollViewRef.scrollTo({
          x: this.state.selectedOffset,
          y: 0,
          animated: !this.initialScroll
        });

        this.initialScroll = false;
      }, 0);
    }
  }

  componentDidMount() {
    const { defaultFilterOption, setFilterOption } = this.props;

    const option = prop('option', defaultFilterOption);

    if (option) {
      setFilterOption({ primarySelectedOption: option });
    }
  }

  render() {
    const { filterOptions, selectedOption } = this.props;
    const { paddingLeft, paddingRight } = this.state;

    return (
      <View style={styles.container}>
        <Image
          style={[styles.gradientOverlay, styles.gradientOverlayLeft]}
          source={assets.filterGradientLeft}
        />
        <ScrollView
          ref={ref => {
            this.scrollViewRef = ref;
          }}
          contentContainerStyle={styles.scrollContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.filterRow, { paddingLeft, paddingRight }]}>
            {filterOptions.map((option, index) => {
              const { id } = option;

              return (
                <FilterItem
                  {...{ selectedOption, ...option }}
                  onLayout={({ nativeEvent: { layout } }) => {
                    this.collectOptionWidth(index, layout.width);
                  }}
                  key={id}
                  pressHandler={() => {
                    this.handlePress(id);
                  }}
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
  setFilterOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
  filterOptions: PropTypes.array.isRequired,
  defaultFilterOption: PropTypes.object
};
