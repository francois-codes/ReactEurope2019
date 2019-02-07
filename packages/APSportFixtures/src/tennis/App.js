import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { AsyncContent } from '@applicaster/london-rn-components';

import { getCurrentSeason, getGrandSlamData, getLiveEventsData } from './api';

import RoundTypeSelector from './components/RoundTypeSelector';

import manifest from '../../plugin-manifest.android.json';

import { ERROR_MESSAGES } from '../const';

const { ZappPlugin } = NativeModules;

const styles = StyleSheet.create({
  wrapper: { flex: 1, width: Dimensions.get('window').width }
});

const urlMethods = {
  'v1/live-scores?': getLiveEventsData,
  'v1/events?': getGrandSlamData,
  'ui/tabs/events?': url =>
    getCurrentSeason(url).then(({ feedUrl }) => getGrandSlamData(feedUrl))
};

class App extends Component {
  constructor(props) {
    super(props);

    this.pullData = this.pullData.bind(this);
  }

  getPluginConfig() {
    if (ZappPlugin) {
      return ZappPlugin.getConfiguration('TennisGrandslamCalendar-fullscreen');
    }

    return Promise.resolve(
      Object.entries(manifest.custom_configuration_fields).reduce(
        (acc, entry) => ({ ...acc, [entry[1].key]: entry[1].default }),
        {}
      )
    );
  }

  pullData() {
    /* eslint camelcase: 0 */
    const { extra_props: { dataUrl, data_source_model } } = this.props;
    const url = dataUrl || data_source_model.extensions.dataUrl;

    const methodKey = Object.keys(urlMethods).find(key => url.includes(key));

    if (!methodKey) {
      throw new Error(`Unrecognised feed URL (${url}) detected`);
    }

    const method = urlMethods[methodKey];

    return method(url)
      .then(rounds => ({
        rounds,
        isList: method === getLiveEventsData,
        isFullScreen: !!dataUrl
      }))
      .then(async data => {
        const pluginConf = await this.getPluginConfig().catch(console.warn);
        return { ...data, ...pluginConf };
      });
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <AsyncContent
          dataFetcher={this.pullData}
          errorMessageText={ERROR_MESSAGES.network}
          refreshInterval={30000}
        >
          <RoundTypeSelector />
        </AsyncContent>
      </View>
    );
  }
}

App.propTypes = {
  extra_props: PropTypes.object,
  dataUrl: PropTypes.string
};

export default App;
