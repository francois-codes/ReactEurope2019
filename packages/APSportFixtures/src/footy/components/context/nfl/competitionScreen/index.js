import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { compose, prop, isNil, when } from 'ramda';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { WidthClamp } from '@applicaster/london-rn-components';

import {
  getFilterOptions,
  groupData,
  selectCurrentOption,
  getFeedUrl
} from '../../../../helpers/filter';
import { Filter, PrimaryHeader, Fixture, AsyncContent } from '../../../index';
import { setMatchGroup as setMatchGroupAction } from '../../../../actions';
import { TABLET_CUTOFF } from '../../../../../const';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  inner: { maxWidth: '100%', marginBottom: 100, width: '100%' },
  titleWrapper: { marginVertical: 16 },
  wrapper: { marginHorizontal: 16 }
});

class CompetitionScreenNFL extends PureComponent {
  renderTitles(values, title) {
    return (
      <View style={styles.titleWrapper}>
        <PrimaryHeader {...{ title }} />
      </View>
    );
  }

  renderGroup({ match, values, groupTitle }) {
    return (
      <View key={shortid.generate()}>
        {this.renderTitles(values, groupTitle)}
        <View style={styles.wrapper}>
          <WidthClamp maxWidth={TABLET_CUTOFF}>
            {match.map((game, index) => (
              <Fixture {...{ game, index }} key={game.id} />
            ))}
          </WidthClamp>
        </View>
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

    const groupBy = { property: ['match_date'], type: 'full-date', prefix: '' };

    const filterOptions = getFilterOptions(data);
    const defaultFilterOption = selectCurrentOption(data);

    const filteredMatches = this.getFilteredMatches(filterOptions);

    const matchGroups =
      filteredMatches && groupData(filteredMatches, false, groupBy);

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

CompetitionScreenNFL.propTypes = {
  data: PropTypes.array,
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

export default connect(mapStateToProps, mapDispatchToProps)(
  CompetitionScreenNFL
);
