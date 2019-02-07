import {
  splitEvery,
  compose,
  groupWith,
  path,
  isNil,
  prop,
  omit,
  merge,
  __,
  last,
  propOr,
  head,
  length,
  nth,
  findIndex,
  propEq,
  slice,
  inc,
  reduce,
  concat,
  map
} from 'ramda';

const getAlpha = () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const getGroupTitle = (group, index) => {
  const name = path([0, 'group', 'name'], group);
  if (name) {
    return name;
  }
  const alphabet = getAlpha();
  const letter = alphabet[index];
  return `Gruppe ${letter}`;
};

const wrapGroups = groups =>
  groups.map((group, index) => {
    const title = getGroupTitle(group, index);
    return {
      title,
      standings: group
    };
  });

const groupFootballData = compose(
  wrapGroups,
  splitEvery(4)
);

const groupDataNFL = data => {
  const comparator = ({ group: { name: a } }, { group: { name: b } }) =>
    a === b;

  return compose(
    wrapGroups,
    groupWith(comparator)
  )(data);
};

export const groupData = (data, competition) => {
  if (competition === 'nfl') {
    return groupDataNFL(data);
  }
  if (competition === 'bundesliga') {
    return [
      {
        title: '',
        standings: data
      }
    ];
  }
  return groupFootballData(data);
};

export const plugInMockData = data => {
  const locations = ['home', 'away'];

  return data.map((item, index) => ({
    ...item,
    location: locations[index < 14 ? 0 : 1]
  }));
};

export const getStandingData = serverResponse => {
  const response = prop('response', serverResponse);
  if (isNil(response)) {
    return [];
  }

  const res = head(response);
  const meta = omit(['standing'], res);
  const standing = propOr([], 'standing')(res);
  return standing.map(merge(__, { meta }));
};

export const getLastSeason = compose(
  last,
  path(['response', '0', 'components', '0', 'elements'])
);

export const getCurrentSeason = data => {
  if (length(data) < 1) return [];
  const elements = path(['response', '0', 'components', '0', 'elements'], data);
  const index = findIndex(propEq('current', '1'))(elements);
  if (index < 0) {
    return last(elements);
  }
  return nth(index, elements);
};

export const getRelevantSpieltags = data => {
  const index = findIndex(propEq('current', '1'))(data);
  if (index < 0) {
    return [head(data)];
  }
  return slice(0, inc(index), data);
};

export const extractCurrentSeasonData = reduce((acc, val) => {
  const meta = omit(['standing'], val);
  const standing = prop('standing', val);
  return compose(
    concat(acc),
    map(merge({ meta }))
  )(standing);
}, []);
