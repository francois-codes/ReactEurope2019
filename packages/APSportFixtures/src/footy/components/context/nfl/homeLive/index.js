import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import shortid from 'shortid';
import { zipObj } from 'ramda';
import { connect } from 'react-redux';

import { WidthClamp } from '@applicaster/london-rn-components';

import { groupData } from '../../../../helpers/filter';
import { PrimaryHeader, SecondaryHeader, Fixture, Empty } from '../../../index';
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

class HomeLiveNFL extends PureComponent {
  renderTitles(values) {
    const { matchday } = zipObj(['matchday'], values);
    const title = `Spieltag ${matchday}`;

    return (
      <View>
        <SecondaryHeader {...{ title }} />
      </View>
    );
  }

  renderGroup({ match, values, groupTitle }) {
    return (
      <View key={shortid.generate()}>
        <PrimaryHeader title="NFL" />
        <View style={styles.wrapper}>
          <WidthClamp maxWidth={TABLET_CUTOFF}>
            {this.renderTitles(values, groupTitle)}
            <View>
              {match.map((game, index) => (
                <Fixture {...{ game, index }} key={shortid.generate()} />
              ))}
            </View>
          </WidthClamp>
        </View>
      </View>
    );
  }

  render() {
    const { data } = this.props;

    const values = [['matchday']];

    const groupBy = { property: ['round', 'name'], type: 'string', prefix: '' };
    const filterBy = { property: ['match_date'], type: 'day', prefix: '' };
    const matchGroups = groupData(data, filterBy, groupBy, values);

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

HomeLiveNFL.propTypes = {
  data: PropTypes.array,
  selectedOption: PropTypes.string
};

const mapStateToProps = state => ({
  selectedOption: state.filter.secondarySelectedOption
});

export default connect(mapStateToProps)(HomeLiveNFL);
