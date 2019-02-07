import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import R from 'ramda';
import PropTypes from 'prop-types';
import url from 'url';
import { AsyncContent } from '@applicaster/london-rn-components';

import Categories from './components/Categories';

import { getRoundsData, groupRoundsBySportCategory } from './api';

import { ERROR_MESSAGES } from '../const';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f8',
    width: Dimensions.get('window').width,
    flex: 0
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    const { dataUrl } = R.path(
      ['extra_props', 'data_source_model', 'extensions'],
      props
    );

    this.state = {
      data: null,
      dataUrl,
      singleDay: !!url.parse(dataUrl, true).query.period
    };

    this.pullData = R.bind(this.pullData, this);
  }

  async pullData() {
    const data = await R.composeP(
      R.ifElse(R.isNil, R.always([]), groupRoundsBySportCategory),
      getRoundsData
    )(this.state.dataUrl);

    return { data };
  }

  render() {
    const { singleDay } = this.state;

    return (
      <View style={styles.container}>
        <AsyncContent
          errorMessageText={ERROR_MESSAGES.network}
          refreshInterval={30000}
          dataFetcher={() => this.pullData()}
        >
          <Categories {...{ singleDay }} />
        </AsyncContent>
      </View>
    );
  }
}

App.propTypes = { extra_props: PropTypes.object.isRequired };

export default App;
