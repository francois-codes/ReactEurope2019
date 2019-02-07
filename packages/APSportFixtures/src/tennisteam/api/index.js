/* eslint camelcase: 0 */
import axios from 'axios';
import url from 'url';
import moment from 'moment';
import R from 'ramda';

const processTeamTies = ties =>
  ties.map(tie => {
    const { id, match: matches, name, season_id: seasonId } = tie;

    const tieResult = {
      home: { wins: 0 },
      away: { wins: 0 },
      status:
        { 0: 'future', [tie.match.length]: 'finished' }[
          matches.filter(match => match.finished === 'yes').length
        ] || 'live',
      round: name.split(' - ')[0]
    };

    matches.forEach(({ home, away, winner_team, feedUrl }) => {
      try {
        const teamCountryCodeProp = R.path(['country', 'code']);
        const homeCountryCode = teamCountryCodeProp(home);
        const winnerCountryCode = teamCountryCodeProp(winner_team);

        if (!tieResult.feedUrl) {
          const {
            protocol,
            host,
            query: { competition, key }
          } = url.parse(feedUrl, true);

          tieResult.feedUrl = `${protocol}//${host}/ran/applicaster/v1/events?key=${key}&sport=tennis&competition=${competition}&season=${seasonId}&round=${id}`;
        }

        tieResult.home.country = home.country;
        tieResult.away.country = away.country;

        if (winner_team) {
          tieResult[
            winnerCountryCode === homeCountryCode ? 'home' : 'away'
          ].wins += 1;
        }
      } catch (e) {
        /* eslint no-console: 0 */
        console.warn('Bad data found - skipping match', e, {
          home,
          away,
          winner_team
        });
      }
    });

    return tieResult;
  });

const groupTiesByRound = ties =>
  ties.reduce((accumulator, tie) => {
    const round = accumulator.find(({ name }) => name === tie.round) || {
      name: tie.round,
      type: 'team',
      ties: []
    };

    round.ties.push(tie);

    if (!accumulator.includes(round)) {
      accumulator.push(round);
    }

    return accumulator;
  }, []);

const getEra = (start, end, now) => {
  if (now > end) {
    return 'past';
  }

  if (now < start) {
    return 'future';
  }

  return 'present';
};

export const groupCompsByEra = (
  comps,
  now = moment(),
  eras = ['present', 'future', 'past']
) =>
  comps
    .map(comp => ({ ...comp, era: getEra(comp.start, comp.end, now) }))
    .reduce(
      (acc, comp) =>
        (index =>
          Object.assign([...acc], {
            [index]: { ...acc[index], comps: [...acc[index].comps, comp] }
          }))(eras.indexOf(comp.era)),
      eras.map(era => ({ era, comps: [] }))
    );

export const fetchRequest = feedUrl =>
  axios
    .get(feedUrl, { timeout: 30000 })
    .then(response => response.data)
    .catch(console.warn); // eslint-disable-line no-console

export const processTeamCompData = data =>
  groupTiesByRound(processTeamTies(data));

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

export const getTeamCompData = feedUrl =>
  fetchRequest(feedUrl)
    .then(({ response }) => response)
    .then(processTeamCompData);

export const getSeasonCompsData = seasonFeedUrl =>
  fetchRequest(seasonFeedUrl).then(({ response }) =>
    response.map(
      ({
        id,
        start,
        end,
        competition: {
          name,
          country: { image: flag }
        },
        feedUrl
      }) => ({
        id,
        name,
        flag,
        start: moment(start, 'DD.MM.YYYY'),
        end: moment(end, 'DD.MM.YYYY'),
        feedUrl
      })
    )
  );
