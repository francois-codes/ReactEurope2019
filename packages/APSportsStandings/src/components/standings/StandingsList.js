import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import shortid from 'shortid';
import { mergeDeepRight } from 'ramda';
import Standing from './Standing';
import SecondaryHeader from '../headers/SecondaryHeader';
import { responsiveMargin, isTablet } from '../../helpers/responsive';

const baseStyles = {
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  section: { justifyContent: 'center', alignItems: 'center' },
  group: { marginBottom: 9 },
  listItem: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8'
  },
  innerListItem: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  bodyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a0aab4',
    textAlign: 'center',
    minWidth: 20
  },
  darkText: { color: '#333333' },
  labelColumn: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '44%',
    paddingLeft: 8
  },
  dataColumn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '56%',
    paddingRight: 16
  }
};

const tabletStyles = {
  labelColumn: { width: '77%', paddingLeft: 4 },
  dataColumn: { width: '23%' }
};

const styles = StyleSheet.create(
  isTablet() ? mergeDeepRight(baseStyles, tabletStyles) : baseStyles
);

class StandingsList extends Component {
  getTableHeader(sport) {
    const titles =
      sport === 'us-sport'
        ? ['Sp.', 'S', 'U', 'N', '%']
        : ['Sp.', 'S', 'U', 'N', '+/-', 'Pkt.'];
    const margins = responsiveMargin();

    return (
      <View style={[styles.listItem]}>
        <View style={[styles.innerListItem, margins]}>
          <View style={[styles.labelColumn]}>
            <Text style={styles.bodyText}>#</Text>
          </View>
          <View style={styles.dataColumn}>
            {titles.map((title, i) => (
              <Text style={styles.bodyText} key={i}>
                {title}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  }

  renderTitle(title) {
    if (title && title !== 'Spieltag') {
      return <SecondaryHeader {...{ title }} />;
    }
    return null;
  }

  renderGroup(group) {
    const { sport } = this.props;
    const { title, standings } = group;
    return (
      <View style={styles.section} key={shortid.generate()}>
        {this.renderTitle(title)}
        <View style={styles.group}>
          {this.getTableHeader(sport)}
          {standings.map((data, index) => (
            <Standing {...{ data, index, sport }} key={shortid.generate()} />
          ))}
        </View>
      </View>
    );
  }

  render() {
    const { standingsGroups } = this.props;

    return (
      <View style={styles.container}>
        {standingsGroups &&
          standingsGroups.length &&
          standingsGroups.map(group => this.renderGroup(group))}
      </View>
    );
  }
}

StandingsList.propTypes = {
  standingsGroups: PropTypes.array,
  sport: PropTypes.string
};

const mapStateToProps = state => ({ sport: state.type.sport });

export default connect(mapStateToProps)(StandingsList);
