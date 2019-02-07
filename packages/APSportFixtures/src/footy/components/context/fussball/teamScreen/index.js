import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import shortid from 'shortid';
import { zipObj, compose, prop, isNil, when, nth, dec } from 'ramda';
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
  PrimaryHeader,
  SecondaryHeader,
  BlockHeader,
  Fixture,
  AsyncContent
} from '../../../index';
import { setMatchGroup as setMatchGroupAction } from '../../../../actions';
import { legNames } from '../../../../helpers/content';
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

class TeamScreen extends PureComponent {
  renderLeg(matchday, group) {
    if (group && group.includes('finale') && matchday !== '0') {
      const legIndex = dec(parseInt(matchday, 10));
      const title = nth(legIndex, legNames);
      return <BlockHeader {...{ title }} />;
    }
    return null;
  }

  getSubTitle(matchday, group) {
    if (group === 'Spieltag' && matchday !== '0') {
      return `${group} ${matchday}`;
    }

    return group || null;
  }

  renderTitles(values, title) {
    const { matchday, championship, group } = zipObj(
      ['matchday', 'championship', 'group'],
      values
    );
    const subTitle = this.getSubTitle(matchday, group);

    return (
      <View>
        <PrimaryHeader {...{ title }} />
        <View style={styles.wrapper}>
          <WidthClamp maxWidth={TABLET_CUTOFF}>
            <SecondaryHeader {...{ title: championship, subTitle }} />
            {this.renderLeg(matchday, group)}
          </WidthClamp>
        </View>
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

    const values = [['matchday'], ['meta', 'displayName'], ['meta', 'name']];
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

TeamScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TeamScreen);
