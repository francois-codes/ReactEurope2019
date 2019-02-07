import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import url from 'url';

import TennisApp from './tennis/App';
import TennisTeamApp from './tennisteam/App';
import MotorsportsApp from './motorsports/App';
import FootyApp from './footy/App';
import AllLiveEvents from './AllLiveEvents';

import withErrorBoundary from './withErrorBoundary';
import { sendOnLoadEvent } from './analytics';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f6f6f8',
    width: Dimensions.get('screen').width
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    color: '#414954',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

const isTennisTeamCompetition = (pathname, competition, round) =>
  pathname.split('/').pop() === 'topic-competition-events' ||
  (!round &&
    competition &&
    (competition.includes('davis-cup') || competition === 'fed-cup'));

const App = props => {
  const {
    extra_props: {
      dataUrl,
      title: liveTitle,
      data_source_model: {
        title: extensionsLiveTitle = 'Livescores',
        extensions: { appContext, dataUrl: extensionsDataUrl } = {}
      } = {}
    }
  } = props;
  const isFullScreen = !!dataUrl;
  const title = extensionsLiveTitle || liveTitle;
  const feedUrl = dataUrl || extensionsDataUrl;
  const {
    query: { sport, competition, round },
    pathname
  } = url.parse(feedUrl, true);
  const isLiveScores = pathname.includes('live-scores');

  if (isFullScreen) {
    sendOnLoadEvent(sport);
  }

  return (
    <View style={[styles.wrapper, { flex: isFullScreen ? 1 : 0 }]}>
      {isLiveScores ? <Text style={styles.header}>{title}</Text> : null}
      {(() => {
        if (appContext === 'homeLive') {
          return (
            <AllLiveEvents
              {...{
                dataUrl: feedUrl,
                appContext
              }}
            />
          );
        }

        if (sport === 'tennis') {
          return isTennisTeamCompetition(pathname, competition, round) ? (
            <TennisTeamApp {...props} />
          ) : (
            <TennisApp {...props} />
          );
        }

        if (['motorsport', 'formel1', 'dtm'].includes(sport)) {
          return <MotorsportsApp {...props} />;
        }

        return <FootyApp {...props} />;
      })()}
    </View>
  );
};

App.propTypes = { extra_props: PropTypes.object };

export default withErrorBoundary(App);
