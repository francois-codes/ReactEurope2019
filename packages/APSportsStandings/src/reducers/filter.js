import {
  SET_PRIMARY_FILTER_OPTION,
  SET_SECONDARY_FILTER_OPTION
} from '../actions';
import { INITIAL_STATE } from './index';

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_PRIMARY_FILTER_OPTION:
    case SET_SECONDARY_FILTER_OPTION:
      return state.merge(payload);
    default:
      return state;
  }
};
