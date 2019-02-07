import React from 'react';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../../src/App';

const feedStart = 'https://middleware.7tv.de/ran/applicaster/v1/';
const key = 'b983404b51cb6a2e7b0058f79aa6ff41';

const exampleFeeds = [
  {
    title: 'Entire Season',
    feed: `${feedStart}topic-events?key=${key}&topic=137&sport=formel1`
  },
  {
    title: 'Live Motorsports',
    feed: `${feedStart}live-scores?key=${key}&sport=motorsport&period=24`
  }
];

exampleFeeds.reduce(
  (acc, { title, feed }) =>
    acc.add(title, () => (
      <App
        extra_props={{ data_source_model: { extensions: { dataUrl: feed } } }}
      />
    )),
  storiesOf('APSportFixtures/motorsports', module)
);
