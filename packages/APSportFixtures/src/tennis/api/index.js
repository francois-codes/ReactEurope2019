/* eslint camelcase: 0 */
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/de';
import R from 'ramda';

moment.locale('de');

const groupListBy = (
  listToGroup,
  groupingTest,
  initiator,
  itemsKey = 'items'
) =>
  listToGroup.reduce((accumulator, item) => {
    const group = accumulator.find(groupingTest(item)) || initiator(item);

    group[itemsKey].push(item);

    if (!accumulator.includes(group)) {
      accumulator.push(group);
    }

    return accumulator;
  }, []);

const groupMatchesByTime = matches =>
  groupListBy(
    matches,
    ({ match_time }) => groupToTest => groupToTest.time === match_time,
    ({ match_time }) => ({ time: match_time, matches: [] }),
    'matches'
  );

const groupMatchesByDate = matches =>
  groupListBy(
    matches,
    ({ match_date }) => groupToTest => groupToTest.date === match_date,
    ({ match_date }) => ({ date: match_date, matches: [] }),
    'matches'
  );

export const groupGrandslamMatchesByDateTime = rounds =>
  rounds.map(round => ({
    name: round.name,
    competitionName: R.path([
      'match',
      '0',
      'round',
      'season',
      'competition',
      'name'
    ])(round),
    days: groupMatchesByDate(round.match).map(day => ({
      date: moment(day.date, 'DD.MM.YYYY'),
      times: groupMatchesByTime(day.matches)
    }))
  }));

const groupMatchesByDateAndTime = R.compose(
  R.map(day => ({
    date: moment(day.date, 'DD.MM.YYYY'),
    times: groupMatchesByTime(day.matches)
  })),
  groupMatchesByDate
);

export const groupMatchesByTopic = matches =>
  groupListBy(
    matches,
    ({
      round: {
        season: {
          competition: { name }
        }
      }
    }) => groupToTest => groupToTest.name === name,
    ({ round: { name } }) => ({ name, match: [] }),
    'match'
  );

export const fetchRequest = url =>
  axios
    .get(url, { timeout: 30000 })
    .then(({ data }) => data)
    .catch(console.warn); // eslint-disable-line no-console

export const getGrandSlamData = url =>
  fetchRequest(url)
    .then(({ response }) => response)
    .then(groupGrandslamMatchesByDateTime);

export const getCurrentSeason = competitionUrl =>
  fetchRequest(competitionUrl).then(
    ({
      response: [
        {
          components: [{ elements }]
        }
      ]
    }) => elements.find(season => season.current === '1')
  );

const groupMatchesByCompetition = matches => {
  const competitionNamePath = R.path([
    'round',
    'season',
    'competition',
    'name'
  ]);

  return R.compose(
    R.map(rounds => ({
      rounds,
      competitionName: competitionNamePath(R.head(rounds))
    })),
    R.values,
    R.groupBy(competitionNamePath)
  )(matches);
};

const groupMatchesByRound = matches => {
  const roundNamePath = R.path(['round', 'name']);

  return R.compose(
    R.map(matchesList => ({
      matches: groupMatchesByDateAndTime(matchesList),
      roundName: roundNamePath(R.head(matchesList))
    })),
    R.values,
    R.groupBy(roundNamePath)
  )(matches);
};

export const groupByRoundsAndCompetitions = R.compose(
  R.map(R.over(R.lensProp('rounds'), groupMatchesByRound)),
  groupMatchesByCompetition
);

export const getLiveEventsData = dayUrl =>
  fetchRequest(dayUrl)
    .then(R.prop('response'))
    .then(groupByRoundsAndCompetitions);
