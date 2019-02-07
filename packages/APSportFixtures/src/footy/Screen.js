import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Provider } from 'react-redux';

import { AsyncContent } from './components';
import '../../reactotronConfig';
import store from './store';
import getContextView from './components/context';
import { getAlerts } from './actions';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#f6f6f8',
    overflow: 'hidden',
    width: Dimensions.get('screen').width
  }
});

export default class Screen extends Component {
  constructor(props) {
    super(props);
    store.dispatch(getAlerts());
  }
  render() {
    const { sport, competition, appContext, data } = this.props;
    const ContextView = getContextView(sport, appContext, competition);

    return (
      <Provider {...{ store }}>
        <View style={styles.container}>
          <AsyncContent {...{ data }}>
            <ContextView {...{ data, competition }} />
          </AsyncContent>
        </View>
      </Provider>
    );
  }
}

Screen.propTypes = {
  sport: PropTypes.string,
  competition: PropTypes.string,
  appContext: PropTypes.string,
  data: PropTypes.array
};

Screen.defaultProps = {
  competition: ''
};
