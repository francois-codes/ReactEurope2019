import { createSelector } from 'reselect';
import { prop, compose, path } from 'ramda';

export const selectStandings = prop('standings');
export const selectFilters = prop('filter');
export const selectSport = path(['type', 'sport']);
export const selectPrimarySelectedOption = compose(
  prop('primarySelectedOption'),
  selectFilters
);
export const selectSecondarySelectedOption = compose(
  prop('secondarySelectedOption'),
  selectFilters
);

export const selectFilteredStandings = createSelector(
  [selectStandings, selectPrimarySelectedOption, selectSecondarySelectedOption],
  (standings, primaryFilter, secondaryFilter) =>
    path([secondaryFilter, primaryFilter])(standings)
);
