import { SET_MATCH_GROUP } from '../actions';
import { INITIAL_STATE } from './index';

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_MATCH_GROUP:
      return state.merge(payload);
    default:
      return state;
  }
};
