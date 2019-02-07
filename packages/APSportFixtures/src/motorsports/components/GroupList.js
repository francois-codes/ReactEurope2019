import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, StyleSheet, Image, Text } from 'react-native';
import moment from 'moment';
import 'moment/locale/de';
import { concat, path, prop, length, either, compose } from 'ramda';

import List from './List';
import { parseDate, convertToLocalTime } from '../../util';
import assets from '../assets/map.json';

const styles = StyleSheet.create({
  title: {
    // fontFamily: 'SFUIText',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#3a3a48'
  },
  secondayTitle: {
    // fontFamily: 'SFUIText',
    fontSize: 13,
    fontWeight: '800',
    fontStyle: 'normal',
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#3a3a48'
  },
  wrapper: { marginLeft: 10 },
  metaText: {
    // fontFamily: 'SFUIText',
    fontSize: 11,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#a0aab4',
    marginTop: 3
  },
  live: { color: '#E22530' },
  image: { width: 52, height: 39 },
  innerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: 36
  },
  innerRowWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  chevron: { width: 6, height: 12, marginRight: 3 }
});

export default class GroupList extends PureComponent {
  static getMetaText({ text, subtext, live, fontSize }) {
    const statusStyle = live ? styles.live : null;
    return (
      <Text style={[styles.metaText, { fontSize }]}>
        {text}
        {subtext ? (
          <Text style={statusStyle}>
            <Text>{'  ·  '}</Text>
            {subtext}
          </Text>
        ) : null}
      </Text>
    );
  }

  static getHeaderMetaText(start, end) {
    if (!start || !end) {
      return '';
    }

    const startDay = moment(start, 'DD.MM.YYYY', 'de').format('DD');
    const endDay = moment(end, 'DD.MM.YYYY', 'de').format('DD MMMM YYYY');

    return `${startDay}-${endDay}`;
  }

  static getHeader({ title, image, start, end }) {
    return [
      {
        target: false,
        elements: (
          <View style={styles.innerRow}>
            <View style={styles.innerRowWrapper}>
              <Image style={styles.image} source={{ uri: image }} />
              <View style={styles.wrapper}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.metaText}>
                  {this.getHeaderMetaText(start, end)}
                </Text>
              </View>
            </View>
          </View>
        )
      }
    ];
  }

  static isLive(startDate, finished) {
    return finished === 'yes' ? false : moment().isAfter(startDate, 'minutes');
  }

  static getSubText(winner, live) {
    if (live) {
      return 'LIVE';
    } else if (winner) {
      return `Sieger: ${winner}`;
    }
    return '';
  }

  static getListContents(data, isSingleDay) {
    return data.map(item => {
      const {
        match_date: matchDate,
        match_time: matchTime,
        round: { name },
        finished,
        feedUrl,
        id
      } = item;
      const date = parseDate(matchDate, matchTime);
      const winner = path(['winner_person', 'name'], item);
      const live = this.isLive(date, finished);
      const meta = {
        text: isSingleDay
          ? convertToLocalTime(matchTime)
          : moment(date, 'de').format('ddd MMM DD'),
        subtext: this.getSubText(winner, live),
        live,
        fontSize: 12
      };
      const img = live ? assets.chevronLive : assets.chevron;
      return {
        feedUrl,
        target: true,
        id,
        elements: (
          <View style={styles.innerRow}>
            <View>
              <Text style={styles.secondayTitle}>{name}</Text>
              {this.getMetaText(meta)}
            </View>
            <Image source={img} style={styles.chevron} />
          </View>
        )
      };
    });
  }

  static groupData(dataSet) {
    const groups = {};
    return dataSet.reduce((data, item) => {
      const competitionId = path(['competition', 'id'], item);
      const groupKey = prop(competitionId, groups);
      if (groupKey !== undefined) {
        data[groupKey].matches.push(item);
      } else {
        groups[competitionId] = length(data);

        const title = compose(
          either(prop('displayName'), prop('name')),
          prop('competition')
        )(item);

        const image = path(['venue', 'country', 'image'], item);
        const start = either(
          path(['round', 'season', 'start']),
          path(['season', 'start'])
        )(item);
        const end = either(
          path(['round', 'season', 'end']),
          path(['season', 'end'])
        )(item);
        data.push({
          meta: { id: competitionId, title, image, start, end },
          matches: [item]
        });
      }
      return data;
    }, []);
  }
  render() {
    const { data, singleDay } = this.props;
    const groups = GroupList.groupData(data);

    return (
      <FlatList
        scrollEnabled={false}
        keyExtractor={(item, index) => `row-${index}`}
        data={groups.map(({ meta, matches }) => ({
          id: meta.id,
          elems: concat(
            GroupList.getHeader(meta),
            GroupList.getListContents(matches, singleDay)
          )
        }))}
        renderItem={({ item }) => <List items={item.elems} />}
        ListFooterComponent={<View style={{ height: 16 }} />}
      />
    );
  }
}

GroupList.propTypes = {
  data: PropTypes.array.isRequired,
  singleDay: PropTypes.bool
};
