import React from 'react';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../../src/App';

const key = 'b983404b51cb6a2e7b0058f79aa6ff41';
const feedRoot = 'https://middleware-preprod.7tv.de/ran/applicaster/v1/';
const feedStart = `${feedRoot}ui/tabs/standings?key=${key}&`;

const exampleFeeds = [
  {
    title: 'Fussball',
    appContext: 'fussball',
    feed: `${feedStart}sport=fussball&competition=bundesliga`
  },
  {
    title: 'NFL',
    appContext: 'nfl',
    feed: `${feedStart}sport=us-sport&competition=nfl`
  },
  {
    title: 'Fussball - bad feed',
    appContext: 'fussball',
    feed: `${feedRoot}ui/tabs/events?key=${key}&sport=fussball&competition=dfb-pokal`
  }
];

exampleFeeds.reduce(
  (acc, { title, appContext, feed }) =>
    acc.add(title, () => (
      <App
        extra_props={{
          data_source_model: { extensions: { appContext, dataUrl: feed } }
        }}
      />
    )),
  storiesOf('APSportStandings', module)
);
