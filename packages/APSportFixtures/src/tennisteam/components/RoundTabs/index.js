import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import TieList from '../TieList';
import CustomTabBar from './CustomTabBar';

class RoundTabs extends Component {
  constructor(props) {
    super(props);

    const { rounds, lastIndexFocus } = props;

    this.state = { index: lastIndexFocus ? rounds.length - 1 : 0 };
  }
  render() {
    const { index } = this.state;
    const { rounds } = this.props;

    return (
      <View>
        <CustomTabBar
          {...{
            index,
            routes: rounds.map(({ name }) => ({
              title: name
            }))
          }}
          onTabPress={tabIndex => {
            this.setState({ index: tabIndex });
          }}
        />
        <TieList data={rounds[index].ties} />
      </View>
    );
  }
}

RoundTabs.propTypes = {
  rounds: PropTypes.array.isRequired,
  lastIndexFocus: PropTypes.bool
};

RoundTabs.defaultProps = { lastIndexFocus: false };

export default RoundTabs;
