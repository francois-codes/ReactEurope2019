import React, { PureComponent } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { path, propOr } from 'ramda';
import { ErrorBoundary, AsyncContent } from '@applicaster/london-rn-components';

import ContentView from './components/ContentView';

import { getData, getCategorisedData } from './api';
import { getParams } from './helpers/util';

const styles = StyleSheet.create({
  container: { flex: 0, backgroundColor: '#f6f6f8' }
});

const topicMap = { tennis: ['174', '175'], motorsport: ['137', '185'] };

const GENERAL_ERR =
  'Generische Fehlermeldung - Momentan ist kein Inhalt verfügbar';
const NETWORK_ERR =
  'Netzwerk Fehlermeldung - Momentan ist kein Inhalt verfügbar';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.pullData = this.pullData.bind(this);
  }

  getDataUrl() {
    const { extra_props } = this.props;

    return propOr(
      path(['data_source_model', 'extensions', 'dataUrl'])(extra_props),
      'dataUrl'
    )(extra_props);
  }

  getSport() {
    const [sport, topic] = getParams(['sport', 'topic'], this.getDataUrl());

    return topic
      ? Object.keys(topicMap).find(key => topicMap[key].includes(topic))
      : sport;
  }

  pullData() {
    const url = this.getDataUrl();

    if (url.includes('/tabs/')) {
      return getCategorisedData(url).then(data => ({ categorisedData: data }));
    }

    return getData(url).then(({ response }) => ({
      listData: Array.isArray(response) ? response : [response]
    }));
  }

  render() {
    const { width: deviceWidth } = Dimensions.get('window');
    const sport = this.getSport();

    return (
      <ErrorBoundary errorMessageText={GENERAL_ERR}>
        <View style={[styles.container, { width: deviceWidth }]}>
          <AsyncContent
            dataFetcher={this.pullData}
            errorMessageText={NETWORK_ERR}
          >
            <ContentView {...{ sport }} />
          </AsyncContent>
        </View>
      </ErrorBoundary>
    );
  }
}

App.propTypes = { extra_props: PropTypes.object };

export default App;
