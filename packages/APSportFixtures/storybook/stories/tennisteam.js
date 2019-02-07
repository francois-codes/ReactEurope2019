import React from 'react';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../../src/App';
import TennisTeamApp from '../../src/tennisteam/App';

import unfinishedExample from '../fixtures/unfinished-tennis-team-competition.json';

const feedStart = 'https://middleware.7tv.de/ran/applicaster/v1/';
const key = 'b983404b51cb6a2e7b0058f79aa6ff41';

storiesOf('APSportFixtures/tennisteam', module)
  .add('Davis Cup', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}ui/tabs/events?key=${key}&sport=tennis&competition=davis-cup`
      }}
    />
  ))
  .add('Fed Cup', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}ui/tabs/events?key=${key}&sport=tennis&competition=fed-cup`
      }}
    />
  ))
  .add('Unfinished Davis Cup from static fixture file', () => (
    <TennisTeamApp teamCompData={unfinishedExample.response} />
  ))
  .add('Davis cup group playoffs', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}ui/tabs/events?key=${key}&sport=tennis&competition=davis-cup-playoffs`
      }}
    />
  ))
  .add('WTA Calendar', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}topic-competition-events?key=${key}&sport=tennis&topic=30&withTabs=false`
      }}
    />
  ))
  .add('ATP Calendar', () => (
    <App
      extra_props={{
        dataUrl: `${feedStart}topic-competition-events?key=${key}&sport=tennis&topic=29&withTabs=false`
      }}
    />
  ));
