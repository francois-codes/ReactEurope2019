import {
  is,
  findIndex,
  compose,
  propEq,
  prop,
  nth,
  dec,
  length,
  last,
  find
} from 'ramda';

const keyify = str => str.replace(/ /g, '-').toLowerCase();

export const getFilterPair = (str, prefix) => {
  const label = `${prefix}${str}`;
  const id = keyify(label);
  return { label, id };
};

export const selectLastOption = options => {
  const option = compose(
    keyify,
    prop('displayName'),
    last
  )(options);
  const index = compose(
    dec,
    length
  )(options);
  return { index, option };
};

export const selectCurrentOption = options => {
  const index = findIndex(propEq('current', '1'))(options);
  if (index < 0) {
    return selectLastOption(options);
  }
  const option = compose(
    keyify,
    prop('displayName'),
    nth(index)
  )(options);
  return { index, option };
};

export const getFilterOptions = dataSet => {
  if (is(Array, dataSet) === false) return [];
  return dataSet.map(({ displayName, feedUrl }) => ({
    label: displayName,
    id: keyify(displayName),
    url: feedUrl
  }));
};

export const getFeedUrl = (filterOptions, primaryOption, secondaryOption) => {
  const url = compose(
    prop('url'),
    find(propEq('id', primaryOption))
  )(filterOptions);
  if (url) {
    return `${url}&status=${secondaryOption}`;
  }
  return url;
};
