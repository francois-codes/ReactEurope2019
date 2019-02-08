import React from 'react';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../../src/App';

const feedStart = 'https://middleware.7tv.de/ran/applicaster/v1/';
const key = 'b983404b51cb6a2e7b0058f79aa6ff41';

const exampleFeeds = [
  {
    title: 'football player (all)',
    feed: `${feedStart}ui/persons?key=${key}&sport=fussball&competition=weltmeisterschaft&person=163477`
  },
  {
    title: 'nfl - team',
    feed: `${feedStart}team-info?key=${key}&sport=us-sport&competition=nfl&team=cardinals`
  },
  {
    title: 'football team',
    feed: `${feedStart}team-info?key=${key}&sport=fussball&competition=champions-league&team=apoel`
  },
  {
    title: 'football player',
    feed: `${feedStart}person-info?key=${key}&sport=fussball&competition=weltmeisterschaft&person=163477`
  },
  {
    title: 'football player 2 (empty stats)',
    feed: `${feedStart}ui/persons?key=${key}&sport=fussball&competition=weltmeisterschaft&person=224131`
  },
  {
    title: 'nfl player',
    feed: `${feedStart}person-info?key=${key}&sport=us-sport&competition=nfl&person=140333`
  }
];

exampleFeeds
  .reduce(
    (acc, { title, feed }) =>
      acc.add(title, () => (
        <App
          extra_props={{ data_source_model: { extensions: { dataUrl: feed } } }}
        />
      )),
    storiesOf('APSportInfo', module)
  )
  .add('With direct data URL', () => (
    <App extra_props={{ dataUrl: exampleFeeds[0].feed }} />
  ));
