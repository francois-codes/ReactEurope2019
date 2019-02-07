import axios from 'axios';
import R from 'ramda';

const getCurrentRaceUrl = R.compose(
  R.prop('feedUrl'),
  R.find(R.propEq('current', '1')),
  R.path(['0', 'components', '0', 'elements'])
);

export const getData = url =>
  axios.get(url, { timeout: 30000 }).then(({ data: { response } }) => response);

export const findCompetitionForEachMatch = R.map(
  ({ competition, ...props }) => ({
    ...props,
    competition: R.pathOr(
      competition,
      ['round', 'season', 'competition'],
      props
    )
  })
);

export const getFullRaceInfoForEachRound = R.compose(
  R.ifElse(
    R.isNil,
    R.always(null),
    R.composeP(
      R.reduce(
        (acc, { match: matchArr, ...meta }) =>
          R.concat(matchArr.map(s => ({ ...s, ...meta })), acc),
        []
      ),
      getData
    )
  ),
  R.ifElse(R.isEmpty, R.always(null), getCurrentRaceUrl)
);

const liveScoresExtractor = R.identity;
const defaultExtractor = R.prop('match');
const responseExtractor = R.cond([
  [R.contains('live-scores'), R.always(liveScoresExtractor)],
  [R.T, R.always(defaultExtractor)]
]);

export const getRoundsData = async roundsUrl => {
  const response = await getData(roundsUrl).catch(console.warn);
  const matches = responseExtractor(roundsUrl)(response);
  return findCompetitionForEachMatch(matches);
};

export const groupRoundsBySportCategory = sportrounds =>
  R.compose(
    R.map(([sportname, rounds]) => ({ sportname, rounds })),
    R.toPairs,
    R.groupBy(R.path(['competition', 'topic', 'name']))
  )(sportrounds);

export default {
  getData,
  groupRoundsBySportCategory,
  getRoundsData
};
