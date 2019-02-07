/* eslint no-confusing-arrow: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { navigation } from 'react-native-zapp-bridge';
import {
  WidthClamp,
  withSwipeTapBlocker
} from '@applicaster/london-rn-components';

import assets from '../../assets/map';
import { TABLET_CUTOFF } from '../../../const';

const TouchableOpacityWithBlocker = withSwipeTapBlocker(TouchableOpacity);

const ROW_HEIGHT = 52;

const styles = StyleSheet.create({
  flag: { width: 24, height: 18, marginHorizontal: 8 },
  countryName: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
    color: 'rgb(58, 58, 72)'
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3
  },
  scoreContainerLive: { backgroundColor: 'rgb(230, 22, 36)' },
  winsDigit: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
    color: 'rgb(58, 58, 72)'
  },
  winsDigitLive: { color: 'white' },
  list: { width: '100%', paddingVertical: 16, flex: 0 },
  wrapper: {
    flex: 0,
    width: '100%',
    backgroundColor: 'rgb(246, 246, 248)',
    paddingHorizontal: 16
  },
  rowWrapper: {
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  homeWrapper: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  awayWrapper: { flex: 1, flexDirection: 'row' },
  dividerImage: { width: 6, height: 26 },
  arrowImage: { width: 24, height: 24, position: 'absolute', right: 8, top: 14 }
});

const statusPropType = PropTypes.oneOf(['future', 'live', 'finished']);

const ScoreBox = ({ wins, status }) =>
  status !== 'future' ? (
    <Text
      style={[
        styles.winsDigit,
        status === 'live' ? styles.winsDigitLive : null
      ]}
    >
      {wins}
    </Text>
  ) : null;

ScoreBox.propTypes = {
  wins: PropTypes.number,
  status: statusPropType
};

const Row = ({ home, away, status }) => (
  <View style={styles.rowWrapper}>
    <View style={styles.homeWrapper}>
      <Text style={styles.countryName}>{home.country.name}</Text>
      <Image source={{ uri: home.country.image }} style={styles.flag} />
    </View>
    <View
      style={[
        styles.scoreContainer,
        status === 'live' ? styles.scoreContainerLive : null
      ]}
    >
      <ScoreBox {...{ status, wins: home.wins }} />
      <Image
        style={styles.dividerImage}
        source={
          status === 'live'
            ? assets.imageDividerWhiteSource
            : assets.imageDividerSource
        }
      />
      <ScoreBox {...{ status, wins: away.wins }} />
    </View>
    <View style={styles.awayWrapper}>
      <Image source={{ uri: away.country.image }} style={styles.flag} />
      <Text style={styles.countryName}>{away.country.name}</Text>
    </View>
    {status === 'future' ? null : (
      <Image source={assets.imageArrowSource} style={styles.arrowImage} />
    )}
  </View>
);

Row.propTypes = {
  home: PropTypes.object,
  away: PropTypes.object,
  status: statusPropType
};

const handlePress = feedUrl => {
  navigation.openInternalURL('ransports', {
    bundle: 'APTennisGrandslamCalendar-RN',
    plugin: 'Fixtures Tennis Grand Slam Calendar',
    presentation: 'push',
    'reactProps[dataUrl]': feedUrl
  });
};

const getItemLayout = (data, index) => ({
  length: ROW_HEIGHT,
  offset: index * ROW_HEIGHT,
  index
});

const TieList = ({ data }) =>
  (listHeight => (
    <View style={[styles.wrapper, { height: listHeight + 32 }]}>
      <WidthClamp maxWidth={TABLET_CUTOFF}>
        <FlatList
          scrollEnabled={false}
          style={styles.list}
          {...{ data, getItemLayout }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: { home, away, status, feedUrl } }) =>
            status === 'future' ? (
              <Row {...{ home, away, status }} />
            ) : (
              <TouchableOpacityWithBlocker
                onPress={() => {
                  handlePress(feedUrl);
                }}
                activeOpacity={1}
              >
                <Row {...{ home, away, status }} />
              </TouchableOpacityWithBlocker>
            )
          }
        />
      </WidthClamp>
    </View>
  ))(data.length * ROW_HEIGHT);

TieList.propTypes = { data: PropTypes.array.isRequired };

export default TieList;
