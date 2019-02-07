import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { zipObj, compose, prop, isNil, when, length, nth, inc } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { WidthClamp } from '@applicaster/london-rn-components';

import {
  getFilterOptions,
  groupData,
  selectCurrentOption,
  getFeedUrl
} from '../../../../helpers/filter';
import {
  Filter,
  SecondaryHeader,
  PrimaryHeader,
  Fixture,
  AsyncContent
} from '../../../index';

import { setMatchGroup as setMatchGroupAction } from '../../../../actions';
import { legNames } from '../../../../helpers/content';
import { FOOTBALL_CUP_COMPETITION, TABLET_CUTOFF } from '../../../../../const';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  inner: { maxWidth: '100%', marginBottom: 100, width: '100%' },
  wrapper: { marginHorizontal: 16 }
});

class CompetitionHybrid extends PureComponent {
  getLegTitle(len, index) {
    if (len <= 2) {
      return nth(index, legNames);
    } else if (index === 0 || index === len / 2) {
      const legIndex = Math.round(inc(index) / len);
      return nth(legIndex, legNames);
    }
    return null;
  }

  isCup(competition) {
    return FOOTBALL_CUP_COMPETITION.includes(competition);
  }

  renderLeg(group, leg, index, len) {
    if (leg && leg !== '0') {
      if (
        !group.includes('Gruppe') &&
        !this.isCup(this.props.competition) &&
        len > 1
      ) {
        const title = this.getLegTitle(len, index);
        return title ? <PrimaryHeader {...{ title }} /> : null;
      }
    }
    return null;
  }

  renderTitles(values, title, index, len) {
    const { group, leg } = zipObj(['group', 'leg'], values);
    return (
      <View>
        {this.renderLeg(group, leg, index, len)}
        <SecondaryHeader {...{ title }} />
      </View>
    );
  }

  renderGroup({ match, values, groupTitle }, groupIndex, groupArr) {
    return (
      <View style={styles.wrapper} key={groupTitle}>
        <WidthClamp maxWidth={TABLET_CUTOFF}>
          {this.renderTitles(values, groupTitle, groupIndex, length(groupArr))}
          {match.map((game, index) => (
            <Fixture {...{ game, index }} key={game.id} />
          ))}
        </WidthClamp>
      </View>
    );
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
    const { data } = this.props;

    const values = [['round', 'name'], ['meta', 'matchdays']];

    const groupBy = { property: ['match_date'], type: 'full-date', prefix: '' };
    const filterOptions = getFilterOptions(data);
    const defaultFilterOption = selectCurrentOption(data);

    const filteredMatches = this.getFilteredMatches(filterOptions);

    const matchGroups =
      filteredMatches && groupData(filteredMatches, false, groupBy, values);
    return (
      <View style={styles.container}>
        <Filter {...{ filterOptions, defaultFilterOption }} />
        <View style={styles.inner}>
          <AsyncContent {...{ data: matchGroups }}>
            {matchGroups && matchGroups.map(this.renderGroup.bind(this))}
          </AsyncContent>
        </View>
      </View>
    );
  }
}

CompetitionHybrid.propTypes = {
  data: PropTypes.array,
  competition: PropTypes.string,
  selectedOption: PropTypes.string,
  matches: PropTypes.object,
  setMatchGroup: PropTypes.func
};

const mapStateToProps = state => ({
  selectedOption: state.filter.primarySelectedOption,
  matches: state.matches
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setMatchGroup: setMatchGroupAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionHybrid);
