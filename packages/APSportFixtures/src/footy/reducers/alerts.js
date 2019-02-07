import {
  SET_MODIFYING_ALERT_STATUS,
  SET_ERROR,
  SET_ALERTS,
  ADD_ALERT,
  REMOVE_ALERT
} from '../actions';
import { INITIAL_STATE } from './index';

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case SET_MODIFYING_ALERT_STATUS:
      return state.set('isModifying', payload);
    case SET_ERROR:
      return state.set('error', payload);
    case SET_ALERTS:
      return state.set('alerts', payload);
    case ADD_ALERT:
      return state.update('alerts', alerts => alerts.concat([payload]));
    case REMOVE_ALERT:
      return state.update('alerts', alerts =>
        alerts.filter(id => id !== payload)
      );
    default:
      return state;
  }
};
