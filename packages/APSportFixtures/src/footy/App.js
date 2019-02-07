import React, { Component } from 'react';
import URL from 'url';
import R from 'ramda';
import { AsyncContent } from '@applicaster/london-rn-components';

import getEventsData from '../api';
import { getCurrentSeason } from './helpers/data';
import { isGameLive, getMatchMinute } from '../util';

import { ERROR_MESSAGES } from '../const';

import Screen from './Screen';

export default class App extends Component {
  constructor(props) {
    super(props);

    const { dataUrl: url, appContext } = R.path(
      ['extra_props', 'data_source_model', 'extensions'],
      props
    );

    this.state = { appContext, url };

    this.pullData = this.pullData.bind(this);
  }

  getParam(url, param) {
    return R.compose(
      R.path(['query', param]),
      URL.parse
    )(url, true);
  }

  async pullData() {
    const { url } = this.state;
    const liveEventExtractor = R.path(['response', 'match']);

    const teamEventExtractor = R.path([
      'response',
      '0',
      'components',
      '0',
      'elements'
    ]);

    const usSportExtractor = R.compose(
      R.path(['elements', '0', 'elements']),
      R.last,
      teamEventExtractor
    );

    const defaultExtractor = R.compose(
      R.propOr([], 'elements'),
      getCurrentSeason,
      teamEventExtractor
    );

    const liveScoresExtractor = R.prop('response');

    const responseExtractor = R.cond([
      [R.contains('team-events'), R.always(teamEventExtractor)],
      [R.contains('live-events'), R.always(liveEventExtractor)],
      [R.contains('live-scores'), R.always(liveScoresExtractor)],
      [R.contains('us-sport'), R.always(usSportExtractor)],
      [R.T, R.always(defaultExtractor)]
    ])(url);

    const getLiveMatchData = matches =>
      Promise.all(
        R.map(R.ifElse(isGameLive, getMatchMinute, Promise.resolve))(matches)
      );
    const data = await R.composeP(
      getLiveMatchData,
      R.when(R.isNil, R.always([])),
      responseExtractor,
      getEventsData
    )(url);
    return { data };
  }

  render() {
    const { appContext, url } = this.state;
    const competition = this.getParam(url, 'competition') || '';
    const sport = this.getParam(url, 'sport') || 'fussball';

    return (
      <AsyncContent
        dataFetcher={this.pullData}
        errorMessageText={ERROR_MESSAGES.network}
        refreshInterval={30000}
      >
        <Screen {...{ sport, appContext, competition }} />
      </AsyncContent>
    );
  }
}
