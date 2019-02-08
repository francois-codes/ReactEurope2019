import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { path, propOr } from 'ramda';
import URL from 'url';
import { ErrorBoundary, AsyncContent } from '@applicaster/london-rn-components';

import Info from './components/Info';
import { sendOnLoadEvent } from './analytics';
import ContextAwareRootView from './components/ContextAwareRootView';
import { fetchResponse, fetchAllPlayerData } from './api';

const getUrlQueryString = url => URL.parse(url, true);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f5ae6',
    width: Dimensions.get('screen').width
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  scrollContainer: {
    backgroundColor: '#F2F2F2',
    paddingBottom: 12,
    width: '100%'
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    const { extra_props } = props;
    const url = propOr(
      path(['data_source_model', 'extensions', 'dataUrl'])(extra_props),
      'dataUrl'
    )(extra_props);

    this.state = {
      url,
      fullStats: url.includes('ui/persons'),
      sport: getUrlQueryString(url).query.sport
    };
  }

  async pullData() {
    const data = await (this.state.fullStats
      ? fetchAllPlayerData
      : fetchResponse)(this.state.url);

    return { data };
  }

  componentDidMount() {
    if (this.state.fullStats) {
      sendOnLoadEvent(this.state.sport);
    }
  }

  render() {
    const { sport, fullStats } = this.state;

    const InfoContainer = fullStats ? ScrollView : View;

    return (
      <ErrorBoundary
        fullscreen={fullStats}
        errorMessageText="Generische Fehlermeldung - Momentan ist kein Inhalt verfügbar"
      >
        <ContextAwareRootView style={styles.container} isFullScreen={fullStats}>
          <View style={styles.wrapper}>
            <InfoContainer contentContainerStyle={styles.scrollContainer}>
              <AsyncContent
                dataFetcher={() => this.pullData()}
                errorMessageText="Netzwerk Fehlermeldung - Momentan ist kein Inhalt verfügbar"
              >
                <Info {...{ sport, fullStats }} />
              </AsyncContent>
            </InfoContainer>
          </View>
        </ContextAwareRootView>
      </ErrorBoundary>
    );
  }
}

App.propTypes = { extra_props: PropTypes.object };

export default App;
