/* eslint no-confusing-arrow: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { navigation } from 'react-native-zapp-bridge';
import {
  WidthClamp,
  withSwipeTapBlocker
} from '@applicaster/london-rn-components';

import assets from '../../assets/map';
import { TABLET_CUTOFF } from '../../../const';

const TouchableOpacityWithBlocker = withSwipeTapBlocker(TouchableOpacity);

const headerTranslations = {
  past: 'VERGANGENE TURNIERE',
  present: 'AKTUELLE TURNIERE',
  future: 'ZUKÜNFTIGE TURNIERE'
};

const IS_TABLET = Dimensions.get('window').width > TABLET_CUTOFF;

const ROW_HEIGHT = 56;
const HEADER_HEIGHT = 81;

const styles = StyleSheet.create({
  flag: { width: 32, height: 24, marginRight: 10 },
  list: { flex: 0, width: '100%' },
  wrapper: { flex: 0, width: '100%', backgroundColor: 'rgb(246, 246, 248)' },
  rowWrapper: {
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(239, 239, 242)',
    marginHorizontal: IS_TABLET ? 0 : 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrowImage: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 0,
    top: 16
  },
  header: {
    paddingTop: 32,
    paddingHorizontal: IS_TABLET ? 0 : 16,
    paddingBottom: 16,
    borderBottomColor: 'rgb(232, 232, 232)',
    borderBottomWidth: 1,
    marginBottom: 16
  },
  headerText: {
    fontSize: 13,
    lineHeight: 16,
    color: 'rgb(51, 51, 51)',
    fontWeight: 'bold'
  },
  compNameText: {
    fontSize: 14,
    color: 'rgb(58, 58, 72)',
    lineHeight: 18,
    fontWeight: 'bold'
  },
  compDatesText: { fontSize: 12, lineHeight: 14, color: 'rgb(160, 170, 180)' }
});
const handlePress = feedUrl => {
  navigation.openInternalURL('ransports', {
    bundle: 'APSportFixtures-RN',
    plugin: 'Fixtures',
    presentation: 'push',
    'reactProps[dataUrl]': feedUrl
  });
};

const Row = ({ flag, name, start, end, era, feedUrl }) => {
  const isFuture = era === 'future';

  const rowContent = (
    <View style={styles.rowWrapper}>
      <View style={styles.homeWrapper}>
        <Image source={{ uri: flag }} style={styles.flag} />
      </View>
      <View>
        <Text style={styles.compNameText}>{name}</Text>
        <Text style={styles.compDatesText}>{`${start.format(
          'DD.MM'
        )}. - ${end.format('DD.MM')}.`}</Text>
      </View>
      {isFuture ? null : (
        <Image source={assets.imageArrowSource} style={styles.arrowImage} />
      )}
    </View>
  );

  return isFuture ? (
    rowContent
  ) : (
    <TouchableOpacityWithBlocker
      activeOpacity={1}
      onPress={() => {
        handlePress(feedUrl);
      }}
    >
      {rowContent}
    </TouchableOpacityWithBlocker>
  );
};

Row.propTypes = {
  era: PropTypes.string,
  flag: PropTypes.string,
  name: PropTypes.string,
  start: PropTypes.object,
  end: PropTypes.object,
  isFuture: PropTypes.bool,
  feedUrl: PropTypes.string
};

class EraGroupedCompList extends Component {
  constructor(props) {
    super(props);

    this.state = { height: 0, laid: false };

    this.handleOnLayout = this.handleOnLayout.bind(this);
  }
  handleOnLayout({ nativeEvent: { layout: { height } } }) {
    this.setState({ height, laid: true });
  }
  getListOffset(data, index) {
    return Math.min(
      data.slice(0, index).reduce((acc, { height }) => acc + height, 0),
      data.reduce((acc, { height }) => acc + height, 0) - this.state.height
    );
  }
  render() {
    const { eras } = this.props;

    const rows = eras.reduce(
      (acc, { era, comps }) => [
        ...acc,
        {
          id: `header-${era}`,
          type: 'header',
          text: headerTranslations[era],
          height: HEADER_HEIGHT
        },
        ...comps.map(comp => ({ ...comp, height: ROW_HEIGHT }))
      ],
      []
    );

    const activeIndex = Math.max(
      0,
      rows.findIndex(
        ({ type, id }) => type === 'header' && id !== 'header-past'
      )
    );

    return (
      <View
        style={[
          styles.wrapper,
          {
            height: rows.reduce((acc, { height }) => acc + height, 0)
          }
        ]}
        onLayout={this.handleOnLayout}
      >
        {this.state.laid ? (
          <WidthClamp maxWidth={TABLET_CUTOFF}>
            <FlatList
              scrollEnabled={false}
              style={styles.list}
              {...{ data: rows }}
              keyExtractor={({ id }) => id}
              contentOffset={{ x: 0, y: this.getListOffset(rows, activeIndex) }}
              getItemLayout={(data, index) =>
                index < 0
                  ? { length: 0, offset: 0, index }
                  : {
                      length: data[index].height,
                      offset: data
                        .slice(0, index)
                        .reduce((acc, { height }) => acc + height, 0),
                      index
                    }
              }
              renderItem={({
                item: { type, text, flag, name, start, end, era, feedUrl }
              }) =>
                type === 'header' ? (
                  <View style={styles.header}>
                    <Text style={styles.headerText}>{text}</Text>
                  </View>
                ) : (
                  <Row {...{ flag, name, start, end, era, feedUrl }} />
                )
              }
            />
          </WidthClamp>
        ) : null}
      </View>
    );
  }
}

EraGroupedCompList.propTypes = { eras: PropTypes.array.isRequired };

export default EraGroupedCompList;
