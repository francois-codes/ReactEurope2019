import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import shortid from 'shortid';

import { WidthClamp } from '@applicaster/london-rn-components';

import { groupData } from '../../../../helpers/filter';
import { Fixture, Empty } from '../../../index';
import { TABLET_CUTOFF } from '../../../../../const';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  inner: { maxWidth: '100%', marginBottom: 100, width: '100%' },
  wrapper: { marginHorizontal: 16 }
});

class SportLiveNFL extends PureComponent {
  renderGroup({ match }) {
    return (
      <View style={styles.wrapper} key={shortid.generate()}>
        <WidthClamp maxWidth={TABLET_CUTOFF}>
          {match.map((game, index) => (
            <Fixture {...{ game, index }} key={shortid.generate()} />
          ))}
        </WidthClamp>
      </View>
    );
  }

  render() {
    // group_matchday is 0 for bundesliga but 1 for champions-league
    const groupBy = { property: ['round', 'name'], type: 'string', prefix: '' };
    const filterBy = { property: ['match_date'], type: 'day', prefix: '' };
    const matchGroups = groupData(this.props.data, filterBy, groupBy, []);

    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          {matchGroups.length ? (
            matchGroups.map(this.renderGroup.bind(this))
          ) : (
            <Empty text={'No live events on this day'} />
          )}
        </View>
      </View>
    );
  }
}

SportLiveNFL.propTypes = { data: PropTypes.array };

export default SportLiveNFL;
