import React from 'react';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../../src/App';

const feedStart = 'https://middleware.7tv.de/ran/applicaster/v1/';
const key = 'b983404b51cb6a2e7b0058f79aa6ff41';
storiesOf('APSportFixtures/tennis', module)
  .add('Tennis Live', () => (
    <App
      extra_props={{
        appContext: 'sportLive',
        dataUrl: `${feedStart}live-scores?key=${key}&period=24&sport=tennis`
      }}
    />
  ))
  .add('Live events - new endpoint', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}live-scores?key=${key}&period=24&sport=tennis`
      }}
    />
  ))
  .add('Normal Grandslam', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}ui/tabs/events?key=${key}&sport=tennis&competition=australian-open-damen`
      }}
    />
  ))
  .add('ATP', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}ui/tabs/events?key=${key}&sport=tennis&competition=848`
      }}
    />
  ))
  .add('Davis cup tie', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}events?key=${key}&sport=tennis&competition=davis-cup&season=25854&round=90142`
      }}
    />
  ));
