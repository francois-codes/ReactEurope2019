import { compose, replace, toUpper, split } from 'ramda';

const getSentenceCase = str =>
  compose(replace(/^./, toUpper), replace(/(_|-)/g, ' '))(str);

const upperCaseEach = arr =>
  arr.map(item => replace(/^./, toUpper)(item)).join(' ');

const getTitleCase = str =>
  compose(upperCaseEach, split(' '), replace(/(_|-)/g, ' '))(str);

export { getSentenceCase, getTitleCase };
