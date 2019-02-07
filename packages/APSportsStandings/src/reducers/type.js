import { SET_TYPE } from '../actions';
import { INITIAL_STATE } from './index';

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TYPE:
      return state.merge(payload);
    default:
      return state;
  }
};
