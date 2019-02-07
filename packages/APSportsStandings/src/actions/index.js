import { curry } from 'ramda';

import getStandingsData from '../api';
import { getStandingData } from '../helpers/data';

export const SET_PRIMARY_FILTER_OPTION = 'set_primary_filter_option';
export const SET_SECONDARY_FILTER_OPTION = 'set_secondary_filter_option';
export const SET_TYPE = 'set_type';
export const SET_STANDING_GROUP = 'set_standing_group';

export const setPrimaryFilterOption = option => ({
  type: SET_PRIMARY_FILTER_OPTION,
  payload: option
});

export const setSecondaryFilterOption = option => ({
  type: SET_SECONDARY_FILTER_OPTION,
  payload: option
});

export const setType = option => ({ type: SET_TYPE, payload: option });

export const setSelectedStandingGroup = group => ({
  type: SET_STANDING_GROUP,
  payload: group
});

export const setStandingGroup = curry(
  async ({ primarySelectedOption, secondarySelectedOption, url }, dispatch) => {
    // eslint-disable-next-line no-console
    const serverResponse = await getStandingsData(url).catch(console.warn);
    const standing = getStandingData(serverResponse);

    dispatch(
      setSelectedStandingGroup({
        [secondarySelectedOption]: { [primarySelectedOption]: standing }
      })
    );
  }
);
