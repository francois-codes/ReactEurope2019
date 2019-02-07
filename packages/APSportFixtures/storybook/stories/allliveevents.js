import React from 'react';
import { ScrollView } from 'react-native';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../../src/App';

const baseUrl = 'https://middleware.7tv.de/ran/applicaster/v1/';
const apiKeyParam = 'key=b983404b51cb6a2e7b0058f79aa6ff41';

storiesOf('APSportFixtures/AllLiveEvents', module).add(
  'All live events',
  () => (
    <ScrollView>
      <App
        extra_props={{
          data_source_model: {
            extensions: {
              dataUrl: `${baseUrl}live-scores?${apiKeyParam}&sport=us-sport,fussball,dtm,tennis,formel1&competition=nfl&period=12`,
              appContext: 'homeLive'
            }
          }
        }}
      />
    </ScrollView>
  )
);
