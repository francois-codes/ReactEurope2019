import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import shortid from 'shortid';
import { zipObj, compose, prop, isNil, when } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { WidthClamp } from '@applicaster/london-rn-components';

import {
  groupData,
  getNumberOfDaysFromToday,
  getFilterOptions,
  getFeedUrl,
  selectCurrentOption
} from '../../../../helpers/filter';
import {
  SecondaryHeader,
  BlockHeader,
  TertiaryHeader,
  Fixture,
  AsyncContent
} from '../../../index';
import { getTitleCase } from '../../../../helpers/formatting';
import {
  setMatchGroup as setMatchGroupAction,
  setPrimaryFilterOption as setPrimaryFilterOptionAction
} from '../../../../actions';
import { TABLET_CUTOFF } from '../../../../../const';

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  inner: { maxWidth: '100%', marginBottom: 100, width: '100%' },
  wrapper: { marginHorizontal: 16 }
});

class HomeLatestHybrid extends PureComponent {
  getDay(matchday, groupMatchday, round) {
    if (matchday !== '0') {
      return matchday;
    } else if (groupMatchday !== '0') {
      return groupMatchday;
    } else if (round !== '0') {
      return round;
    }
    return '';
  }
  renderTitles(values, title) {
    const { competition } = this.props;
    const { groupMatchday, matchday, group, round } = zipObj(
      ['matchDate', 'groupMatchday', 'matchday', 'group', 'round'],
      values
    );
    const day = this.getDay(matchday, groupMatchday, round);
    const subTitle = day && `Spieltag ${day}`;

    return (
      <View>
        <SecondaryHeader {...{ title: getTitleCase(competition), subTitle }} />
        <TertiaryHeader {...{ title: group }} />
        <BlockHeader {...{ title }} />
      </View>
    );
  }

  renderGroup({ match, values, groupTitle }) {
    return (
      <View style={styles.wrapper} key={shortid.generate()}>
        <WidthClamp maxWidth={TABLET_CUTOFF}>
          {this.renderTitles(values, groupTitle)}
          {match.map((game, index) => (
            <Fixture {...{ game, index }} key={game.id} />
          ))}
        </WidthClamp>
      </View>
    );
  }

  isNearlyToday(item) {
    const { values } = item;
    const { matchDate } = zipObj(['matchDate'], values);

    const numberOfDays = getNumberOfDaysFromToday(matchDate);

    if (numberOfDays >= -1 && numberOfDays <= 2) return true;
    return false;
  }

  getFilteredMatches(filterOptions) {
    const { matches, selectedOption, setMatchGroup } = this.props;
    return compose(
      when(isNil, () => {
        const url = getFeedUrl(filterOptions, selectedOption);
        if (url) {
          setMatchGroup({ selectedOption, url });
        }
      }),
      prop(selectedOption)
    )(matches);
  }

  render() {
    const { data, setFilterOption } = this.props;

    const values = [
      ['match_date'],
      ['group_matchday'],
      ['matchday'],
      ['round', 'name'],
      ['round', 'round_order']
    ];

    const groupBy = { property: ['match_date'], type: 'day', prefix: '' };
    const filterOptions = getFilterOptions(data);
    const { option } = selectCurrentOption(data);
    setFilterOption({
      primarySelectedOption: option
    });
    const filteredMatches = this.getFilteredMatches(filterOptions);

    const matchGroups =
      filteredMatches && groupData(filteredMatches, false, groupBy, values);

    const filteredGroups =
      matchGroups && matchGroups.filter(this.isNearlyToday);

    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <AsyncContent {...{ data: filteredGroups }}>
            {filteredGroups && filteredGroups.map(this.renderGroup.bind(this))}
          </AsyncContent>
        </View>
      </View>
    );
  }
}

HomeLatestHybrid.propTypes = {
  data: PropTypes.array,
  competition: PropTypes.string,
  selectedOption: PropTypes.string,
  matches: PropTypes.object,
  setMatchGroup: PropTypes.func,
  setFilterOption: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  selectedOption: state.filter.primarySelectedOption,
  matches: state.matches
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setMatchGroup: setMatchGroupAction,
      setFilterOption: setPrimaryFilterOptionAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeLatestHybrid);
