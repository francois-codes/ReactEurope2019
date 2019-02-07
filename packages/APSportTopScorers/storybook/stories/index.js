import React from 'react';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../../src/App';

const feedStart = 'https://middleware.7tv.de/ran/applicaster/v1/';
const key = 'b983404b51cb6a2e7b0058f79aa6ff41';

const exampleFeeds = [
  {
    title: 'Football Champions League',
    feed: `${feedStart}goalscorer?key=${key}&sport=fussball&competition=champions-league`
  },
  {
    title: 'Football country Australia',
    feed: `${feedStart}goalscorer?key=${key}&sport=fussball&competition=weltmeisterschaft&team=australien`
  },
  {
    title: 'formel1 - person',
    feed: `${feedStart}topic-person-standings?key=${key}&topic=137`
  },
  {
    title: 'formel1 - team',
    feed: `${feedStart}topic-team-standings?key=${key}&topic=137`
  },
  {
    title: 'tennis - team',
    feed: `${feedStart}topic-team-standings?key=${key}&topic=174`
  },
  {
    title: 'tennis - person',
    feed: `${feedStart}topic-person-standings?key=${key}&topic=174`
  },
  {
    title: 'tennis - person (with categories)',
    feed: `${feedStart}ui/tabs/world-standings?key=${key}&sport=tennis`
  },
  {
    title: 'Deutsche Tourenwagen Masters (DMT)',
    feed: `${feedStart}topic-person-standings?key=${key}&topic=185`
  }
];

exampleFeeds.reduce(
  (acc, { title, feed }) =>
    acc.add(title, () => (
      <App
        extra_props={{ data_source_model: { extensions: { dataUrl: feed } } }}
      />
    )),
  storiesOf('APSportTopScorers', module)
);
