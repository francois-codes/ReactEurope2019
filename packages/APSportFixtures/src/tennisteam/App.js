/* eslint camelcase: 0 */
import React, { Component } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { AsyncContent } from '@applicaster/london-rn-components';

import {
  getTeamCompData,
  getCurrentSeason,
  processTeamCompData,
  getSeasonCompsData,
  groupCompsByEra
} from './api';

import { ERROR_MESSAGES } from '../const';

import CompetitionTypeSelector from './components/CompetitionTypeSelector';

const styles = StyleSheet.create({
  wrapper: { flex: 0, width: Dimensions.get('window').width }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.pullData = this.pullData.bind(this);
  }

  pullData() {
    const {
      extra_props: { dataUrl, data_source_model } = {},
      teamCompData
    } = this.props;

    if (teamCompData) {
      return Promise.resolve({ rounds: processTeamCompData(teamCompData) });
    }

    const url = dataUrl || data_source_model.extensions.dataUrl;

    if (url.includes('/topic-competition-events?')) {
      return getSeasonCompsData(url)
        .then(groupCompsByEra)
        .then(eras => ({ eras }));
    }

    return getCurrentSeason(url)
      .then(({ feedUrl }) => getTeamCompData(feedUrl))
      .then(rounds => ({ rounds }));
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <AsyncContent
          dataFetcher={this.pullData}
          errorMessageText={ERROR_MESSAGES.network}
          refreshInterval={30000}
        >
          <CompetitionTypeSelector />
        </AsyncContent>
      </View>
    );
  }
}

App.propTypes = {
  teamCompData: PropTypes.array,
  extra_props: PropTypes.object
};

export default App;
