import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../../src/App';
import Filter from '../../src/footy/components/filter/Filter';

const baseUrl = 'https://middleware.7tv.de/ran/applicaster/v1/';
const apiKeyParam = 'key=b983404b51cb6a2e7b0058f79aa6ff41';

class FilterExample extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedOption: 'finale' };
  }
  render() {
    return (
      <Filter
        {...{
          filterOptions: [
            { label: '1. Runde', id: '1.-runde' },
            { label: '2. Runde', id: '2.-runde' },
            { label: 'Achtelfinale', id: 'achtelfinale' },
            { label: 'Viertelfinale', id: 'viertelfinale' },
            { label: 'Halbfinale', id: 'halbfinale' },
            { label: 'Finale', id: 'finale' }
          ],
          selectedOption: this.state.selectedOption,
          setFilterOption: opt => {
            this.setState({
              selectedOption: opt.primarySelectedOption
            });
          }
        }}
      />
    );
  }
}

const exampleFeeds = [
  {
    title: 'Football - Live',
    feed: `${baseUrl}live-scores?${apiKeyParam}&sport=fussball&period=24&date=2018-12-08T00:00:00`,
    context: 'sportLive'
  },
  {
    title: 'competitionScreen - fussball - em',
    feed: `${baseUrl}ui/tabs/events?${apiKeyParam}&sport=fussball&competition=europameisterschaft`,
    context: 'competitionScreen'
  },
  {
    title: 'competitionScreen - fussball - WM',
    feed: `${baseUrl}ui/tabs/events?${apiKeyParam}&sport=fussball&competition=weltmeisterschaft`,
    context: 'competitionScreen'
  },
  {
    title: 'competitionScreen - fussball - BL',
    feed: `${baseUrl}ui/tabs/events?${apiKeyParam}&sport=fussball&competition=bundesliga`,
    context: 'competitionScreen'
  },
  {
    title: 'competitionScreen - fussball',
    feed: `${baseUrl}ui/tabs/events?${apiKeyParam}&sport=fussball&competition=dfb-pokal`,
    context: 'competitionScreen'
  },
  {
    title: 'competitionScreen - us-sport',
    feed: `${baseUrl}ui/tabs/events?${apiKeyParam}&sport=us-sport&competition=nfl`,
    context: 'competitionScreen'
  },
  {
    title: 'teamScreen - us-sport',
    feed: `${baseUrl}tabs/team-events?${apiKeyParam}&sport=us-sport&team=dolphins`,
    context: 'teamScreen'
  },
  {
    title: 'teamScreen - fussball',
    feed: `${baseUrl}tabs/team-events?${apiKeyParam}&sport=fussball&team=liverpool`,
    context: 'teamScreen'
  }
];

exampleFeeds
  .reduce(
    (acc, { title, feed: dataUrl, context: appContext }) =>
      acc.add(title, () => (
        <ScrollView>
          <App
            extra_props={{
              data_source_model: {
                title: 'footy LIVE scores',
                extensions: { dataUrl, appContext }
              }
            }}
          />
        </ScrollView>
      )),
    storiesOf('APSportFixtures/footy', module)
  )
  .add('Filter options (last selected)', () => <FilterExample />);
