import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { navigation } from 'react-native-zapp-bridge';
import {
  WidthClamp,
  withSwipeTapBlocker
} from '@applicaster/london-rn-components';

import { TABLET_CUTOFF } from '../../const';

const TouchableOpacityWithBlocker = withSwipeTapBlocker(TouchableOpacity);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    marginTop: 16,
    marginHorizontal: 16
  },
  row: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%'
  }
});

const handlePress = feedUrl => {
  const params = {
    bundle: 'APSportLiveMatch-RN',
    plugin: 'APSportLiveMatch',
    presentation: 'presentNoNavigation',
    'reactProps[dataUrl]': feedUrl
  };
  navigation.openInternalURL('ransports', params);
};

const List = ({ items }) => (
  <View style={styles.container}>
    <WidthClamp maxWidth={TABLET_CUTOFF}>
      {items.map(({ target, elements, feedUrl, id }) => {
        const RowComponent = target ? TouchableOpacityWithBlocker : View;
        const optionalArgs = target
          ? { onPress: () => handlePress(feedUrl) }
          : null;

        return (
          <RowComponent
            activeOpacity={1}
            key={id || 'header'}
            style={styles.row}
            {...optionalArgs}
          >
            {elements}
          </RowComponent>
        );
      })}
    </WidthClamp>
  </View>
);

List.propTypes = { items: PropTypes.array };

export default List;
