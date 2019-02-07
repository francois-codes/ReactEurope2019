import {
  compose,
  prop,
  merge,
  isNil,
  length,
  keys,
  pluck,
  __,
  flatten,
  omit,
  findIndex,
  propEq,
  nth,
  last,
  head,
  props
} from 'ramda';

export const plugInChamiopnship = dataSet => {
  const dataKeys = keys(dataSet);
  return dataKeys.map(k => {
    const meta = omit(['match'], dataSet[k]);
    return dataSet[k].match.map(merge(__, { meta }));
  });
};

export const PlugInTeamMeta = dataSet =>
  dataSet.reduce((acc, championship) => {
    const [displayName, seasons] = props(['name', 'season'], championship);
    const matches = seasons.map(season => {
      const rounds = prop('round', season);
      return rounds.map(round => {
        const meta = compose(merge({ displayName }), omit(['match']))(round);
        return round.match.map(merge(__, { meta }));
      });
    });
    return [...acc, ...matches];
  }, []);

export const mergeMatches = dataSet => pluck('match')(dataSet);

export const getMatchData = (serverResponse, url) => {
  const response = prop('response', serverResponse);
  if (isNil(response)) {
    return [];
  }
  const res = head(response);
  if (url.includes('team-events')) {
    // looking at team-events
    return compose(flatten, PlugInTeamMeta)(response);
  }
  const meta = omit(['match'], res);
  const match = prop(['match'], res) || [];
  return match.map(merge(__, { meta }));
};

export const getCurrentSeason = data => {
  if (length(data) < 1) return [];
  const index = findIndex(propEq('current', '1'))(data);

  return index < 0 ? last(data) : nth(index, data);
};
