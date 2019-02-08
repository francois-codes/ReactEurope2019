/* eslint camelcase: 0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { prop } from 'ramda';
import { WidthClamp } from '@applicaster/london-rn-components';

import CareerTable from './CareerTable';
import StatsTable from './StatsTable';
import AutoHeightImage from './AutoHeightImage';

import commonStyles from './common/styles';

const styles = {
  ...commonStyles,
  ...StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'row',
      marginTop: 20
    },
    imageColumn: {
      flexShrink: 1,
      paddingRight: 18,
      paddingLeft: 26,
      paddingVertical: 13
    },
    image: { width: 94 }
  })
};

class Info extends PureComponent {
  static getPlayerTable({
    country: [{ name: country }],
    image,
    fullname,
    birthday,
    height,
    weight
  }) {
    return {
      table: [
        { label: 'vollst. Name', info: fullname },
        { label: 'Land', info: country },
        { label: 'geboren am', info: birthday },
        { label: 'Größe', info: `${height} cm` },
        { label: 'Gewicht', info: `${weight} kg` }
      ],
      image
    };
  }

  static getTeamTable({
    country: { name: country },
    image,
    team_detail: { fullname, foundation },
    venue: {
      name: venue,
      town: { name: venueLocation },
      venue_detail: { capacity }
    }
  }) {
    return {
      table: [
        { label: 'vollst. Name', info: fullname },
        { label: 'Land', info: country },
        { label: 'gegründet', info: foundation },
        { label: 'Ort', info: venueLocation },
        { label: 'Stadion', info: venue },
        { label: 'Plätze', info: capacity }
      ],
      image
    };
  }

  static getNFLTeamTable({
    image,
    team_detail: { fullname },
    venue: { name: venue }
  }) {
    return {
      table: [
        { label: 'vollst. Name', info: fullname },
        { label: 'Stadion', info: venue },
        { label: 'Owner', info: 'Unavailable' },
        { label: 'Superbowl wins', info: 'Unavailable' }
      ],
      image
    };
  }

  static getAppropriateTable(props) {
    const { data, sport } = props;
    const player = prop('birthday', data);

    if (player) {
      return this.getPlayerTable(data);
    }

    return sport === 'fussball'
      ? this.getTeamTable(data)
      : this.getNFLTeamTable(data);
  }

  render() {
    const { table, image } = Info.getAppropriateTable(this.props);
    const { data: { team_person, stats }, fullStats } = this.props;

    return (
      <WidthClamp maxWidth={796}>
        <View style={styles.container}>
          <View style={styles.imageColumn}>
            <AutoHeightImage source={{ uri: image }} style={styles.image} />
          </View>
          <View style={styles.infoColumn}>
            {table.map(({ label, info }) => (
              <View style={styles.infoRow} key={label}>
                <View style={styles.label}>
                  <Text style={[styles.bodyText, styles.labelText]}>
                    {label}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={[styles.bodyText]}>{info}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        {fullStats && team_person ? <CareerTable jobs={team_person} /> : null}
        {fullStats && stats ? <StatsTable {...{ stats }} /> : null}
      </WidthClamp>
    );
  }
}

Info.propTypes = {
  data: PropTypes.object,
  sport: PropTypes.string,
  fullStats: PropTypes.bool
};

export default Info;
