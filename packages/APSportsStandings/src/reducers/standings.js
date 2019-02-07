import { SET_STANDING_GROUP } from '../actions';
import { INITIAL_STATE } from './index';

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_STANDING_GROUP:
      return state.merge(payload, { deep: true });
    default:
      return state;
  }
};
