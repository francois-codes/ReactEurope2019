import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { when, isNil, path, prop, length } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  selectFilteredStandings,
  selectPrimarySelectedOption,
  selectSecondarySelectedOption,
  selectSport
} from '../../selectors';
import { StandingsList, Filter, SecondaryFilter } from '../index';
import {
  setStandingGroup as setStandingGroupAction,
  setPrimaryFilterOption as setPrimaryFilterOptionAction
} from '../../actions';
import {
  getFilterOptions,
  selectCurrentOption,
  getFeedUrl
} from '../../helpers/filter';

import Empty from '../Empty';

const styles = StyleSheet.create({ flex1: { flex: 1 } });

class StandingsGroup extends Component {
  constructor(props) {
    super(props);
    this.isGroup = props.leagueType === 'group';
    this.filterOptions = this.isGroup && getFilterOptions(props.data);
    this.defaultFilterOption = this.isGroup && selectCurrentOption(props.data);
    this.initialLoad = true;
  }
  getFilteredStandings(filterOptions) {
    const {
      standings,
      primarySelectedOption,
      secondarySelectedOption,
      setStandingGroup
    } = this.props;
    const requestStandingGroup = () => {
      const url = getFeedUrl(
        filterOptions,
        primarySelectedOption,
        secondarySelectedOption
      );
      if (url) {
        setStandingGroup({
          primarySelectedOption,
          secondarySelectedOption,
          url
        });
      }
    };

    return when(isNil, requestStandingGroup)(standings);
  }

  groupData(dataSet) {
    const { sport } = this.props;
    const groups = {};
    return dataSet.reduce((data, item) => {
      const title = path(
        [sport === 'fussball' ? 'round' : 'group', 'name'],
        item
      );
      const groupKey = prop(title, groups);
      if (groupKey !== undefined) {
        data[groupKey].standings.push(item);
      } else {
        groups[title] = length(data);
        data.push({
          title,
          standings: [item]
        });
      }
      return data;
    }, []);
  }

  render() {
    const { data, hasPrimaryFilter, hasSecondaryFilter } = this.props;
    if (!data.length) {
      return <Empty>No data available</Empty>;
    }
    const filteredStandings = this.filterOptions
      ? this.getFilteredStandings(this.filterOptions)
      : data;

    const standingsGroups =
      filteredStandings && this.groupData(filteredStandings);
    const isFirstLoad = !filteredStandings && this.initialLoad;

    if (filteredStandings && this.initialLoad) {
      this.initialLoad = false;
    }

    // Due to the bug on Android initial load can not be done in steps it has to be a single render.
    return !isFirstLoad ? (
      <View style={styles.flex1}>
        {hasPrimaryFilter ? (
          <Filter
            {...{
              filterOptions: this.filterOptions,
              defaultFilterOption: this.defaultFilterOption
            }}
          />
        ) : null}
        {hasSecondaryFilter ? <SecondaryFilter /> : null}
        <ScrollView style={styles.flex1}>
          <StandingsList {...{ standingsGroups }} />
        </ScrollView>
      </View>
    ) : null;
  }
}

StandingsGroup.propTypes = {
  data: PropTypes.array,
  primarySelectedOption: PropTypes.string,
  secondarySelectedOption: PropTypes.string,
  sport: PropTypes.string,
  standings: PropTypes.array,
  setStandingGroup: PropTypes.func,
  hasPrimaryFilter: PropTypes.bool,
  hasSecondaryFilter: PropTypes.bool,
  setPrimaryFilterOption: PropTypes.func,
  leagueType: PropTypes.string
};

const mapStateToProps = state => ({
  primarySelectedOption: selectPrimarySelectedOption(state),
  secondarySelectedOption: selectSecondarySelectedOption(state),
  standings: selectFilteredStandings(state),
  sport: selectSport(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setStandingGroup: setStandingGroupAction,
      setPrimaryFilterOption: setPrimaryFilterOptionAction
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StandingsGroup);
