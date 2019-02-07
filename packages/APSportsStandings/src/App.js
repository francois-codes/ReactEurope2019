import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import {
  path,
  __,
  compose,
  composeP,
  length,
  prop,
  ifElse,
  always,
  propSatisfies,
  gt,
  head,
  split,
  nth
} from 'ramda';
import PropTypes from 'prop-types';

import { ErrorBoundary, AsyncContent } from '@applicaster/london-rn-components';

import { StandingsGroup } from './components';
import '../reactotronConfig';
import store from './store';
import getConfig from './helpers/context';
import {
  getCurrentSeason,
  getRelevantSpieltags,
  extractCurrentSeasonData
} from './helpers/data';
import { setType, setPrimaryFilterOption } from './actions';
import getStandingsData from './api';
import { selectCurrentOption } from './helpers/filter';

const deviceWidth = Dimensions.get('window').width;

const GENERAL_ERR =
  'Generische Fehlermeldung - Momentan ist kein Inhalt verfügbar';
const NETWORK_ERR =
  'Netzwerk Fehlermeldung - Momentan ist kein Inhalt verfügbar';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f8' }
});

class App extends Component {
  constructor(props) {
    super(props);
    const { appContext, dataUrl: url } = path(
      ['extra_props', 'data_source_model', 'extensions'],
      props
    );

    const sport = this.getParam(url, 'sport') || 'fussball';

    this.state = {
      data: null,
      appContext,
      url,
      sport,
      leagueType: ''
    };

    this.pullData = this.pullData.bind(this);
  }

  getParam(url, param) {
    return compose(
      ifElse(
        propSatisfies(gt(__, 1), 'length'),
        compose(
          head,
          split('&'),
          nth(1)
        ),
        always('')
      ),
      split(`${param}=`)
    )(url);
  }

  pullData() {
    const { url, sport } = this.state;

    return getStandingsData(url).then(response => {
      const lastItem = compose(
        prop('elements'),
        getCurrentSeason
      )(response);

      if (sport === 'us-sport') {
        const feedUrl = compose(
          prop('feedUrl'),
          head,
          prop('elements'),
          getCurrentSeason
        )(response);

        return getStandingsData(feedUrl).then(subResponse => ({
          data: compose(
            prop('standing'),
            head,
            prop('response')
          )(subResponse)
        }));
      } else if (length(lastItem) > 1) {
        const feedUrl = compose(
          prop('feedUrl'),
          getCurrentSeason
        )(response);

        return getStandingsData(feedUrl).then(subResponse => ({
          data: extractCurrentSeasonData(subResponse.response),
          leagueType: 'straight'
        }));
      } else if (lastItem) {
        // only show current and past spieltags
        const data = compose(
          getRelevantSpieltags,
          path(['0', 'elements'])
        )(lastItem);
        return {
          data,
          leagueType: 'group'
        };
      }

      return { data: [] };
    });
  }

  setPrimaryFilter(params) {
    const { data, leagueType } = params;
    if (leagueType === 'group') {
      const option = compose(
        prop('option'),
        selectCurrentOption
      )(data);
      if (option) {
        store.dispatch(
          setPrimaryFilterOption({ primarySelectedOption: option })
        );
      }
    }
    return Promise.resolve(params);
  }

  renderContent() {
    const { appContext, url, sport, leagueType } = this.state;

    const competition = this.getParam(url, 'competition') || '';
    store.dispatch(setType({ sport }));

    const { hasPrimaryFilter, hasSecondaryFilter } = getConfig(
      appContext,
      sport,
      competition,
      leagueType
    );

    return (
      <AsyncContent
        dataFetcher={composeP(
          this.setPrimaryFilter,
          this.pullData
        )}
        errorMessageText={NETWORK_ERR}
      >
        <StandingsGroup {...{ hasPrimaryFilter, hasSecondaryFilter }} />
      </AsyncContent>
    );
  }

  render() {
    return (
      <ErrorBoundary errorMessageText={GENERAL_ERR}>
        <Provider {...{ store }}>
          <View style={[styles.container, { width: deviceWidth }]}>
            {this.renderContent()}
          </View>
        </Provider>
      </ErrorBoundary>
    );
  }
}

App.propTypes = { extra_props: PropTypes.object.isRequired };

export default App;
