import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import GrandslamRound from '../GrandslamRound';
import CustomTabBar from './CustomTabBar';

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 10,
    fontWeight: 'bold',
    opacity: 1
  },
  tabs: { backgroundColor: 'white' },
  tab: { opacity: 1 }
});

const LABEL_COLOR = 'rgb(160, 170, 180)';
const LABEL_COLOR_SELCTED = 'rgb(31, 90, 230)';

const getInterpolation = (position, routes, index) =>
  position.interpolate({
    inputRange: routes.map((x, i) => i),
    outputRange: routes.map(
      (x, i) => (i === index ? LABEL_COLOR_SELCTED : LABEL_COLOR)
    )
  });

class RoundTabs extends Component {
  constructor(props) {
    super(props);

    const { rounds, lastIndexFocus } = props;

    this.state = { index: lastIndexFocus ? rounds.length - 1 : 0 };
  }
  renderLabel(props) {
    const { position, navigationState: { routes } } = props;
    return ({ route }) => {
      const color =
        routes.length > 1
          ? getInterpolation(position, routes, routes.indexOf(route))
          : LABEL_COLOR_SELCTED;

      return (
        <Animated.Text style={[styles.label, { color }]}>
          {route.title}
        </Animated.Text>
      );
    };
  }

  render() {
    const { index } = this.state;
    const { rounds, isFullScreen, tapThreshold } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <CustomTabBar
          {...{ index, routes: rounds.map(({ name }) => ({ title: name })) }}
          onTabPress={tabIndex => {
            this.setState({ index: tabIndex });
          }}
        />
        <GrandslamRound
          {...{ isFullScreen, tapThreshold }}
          data={this.props.rounds[index].days}
        />
      </View>
    );
  }
}

RoundTabs.propTypes = {
  rounds: PropTypes.array.isRequired,
  lastIndexFocus: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  tapThreshold: PropTypes.number
};

RoundTabs.defaultProps = {
  lastIndexFocus: false,
  isFullScreen: false
};

export default RoundTabs;
