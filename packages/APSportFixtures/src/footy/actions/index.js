import {
  curry,
  composeP,
  map,
  filter,
  test,
  slice,
  contains,
  ifElse,
  __,
  compose
} from 'ramda';
import { NativeModules } from 'react-native';
import getEventsData from '../../api';
import { getMatchData } from '../helpers/data';

const { PushNotifications } = NativeModules;

if (!PushNotifications) {
  // eslint-disable-next-line no-console
  console.warn('Applicaster `PushNotifications` native module not found.');
}

export const SET_PRIMARY_FILTER_OPTION = 'set_primary_filter_option';
export const SET_MATCH_GROUP = 'set_match_group';
export const REGISTER_ALERT = 'register_alert';
export const UNREGISTER_ALERT = 'unregister_alert';
export const SET_MODIFYING_ALERT_STATUS = 'set_modifying_alert_status';
export const SET_ERROR = 'set_error';
export const SET_ALERTS = 'set_alerts';
export const ADD_ALERT = 'add_alert';
export const REMOVE_ALERT = 'remove_alert';

export const setPrimaryFilterOption = option => ({
  type: SET_PRIMARY_FILTER_OPTION,
  payload: option
});

export const setSelectedMatchGroup = group => ({
  type: SET_MATCH_GROUP,
  payload: group
});

export const setModifyingAlertStatus = bool => ({
  type: SET_MODIFYING_ALERT_STATUS,
  payload: bool
});

export const setAlerts = alerts => ({
  type: SET_ALERTS,
  payload: alerts
});

export const addAlert = id => ({
  type: ADD_ALERT,
  payload: id
});

export const removeAlert = id => ({
  type: REMOVE_ALERT,
  payload: id
});

export const setError = error => ({
  type: SET_ERROR,
  payload: error
});

const removeMatchIdPrefix = slice(2, Infinity);

const filterCorrectTags = filter(test(/ma[0-9]*/g));

const getRegisteredTags = PushNotifications
  ? PushNotifications.getRegisteredTags
  : () => [];

const getTags = composeP(
  map(removeMatchIdPrefix),
  filterCorrectTags,
  getRegisteredTags
);

// THUNKS
export const getAlerts = () => async dispatch => {
  try {
    const tags = await getTags();

    dispatch(setAlerts(tags));
  } catch (err) {
    dispatch(setError(err));
  }
};

export const registerAlert = curry((id, dispatch) => {
  dispatch(setModifyingAlertStatus(true));

  const registerTags = PushNotifications
    ? PushNotifications.registerTags
    : Promise.resolve();

  registerTags([`ma${id}`]).then(
    () => {
      dispatch(addAlert(id));
      dispatch(setModifyingAlertStatus(false));
    },
    err => {
      dispatch(setError(err));
      dispatch(setModifyingAlertStatus(false));
    }
  );
});

export const unRegisterAlert = curry((id, dispatch) => {
  dispatch(setModifyingAlertStatus(true));

  const unregisterTags = PushNotifications
    ? PushNotifications.unregisterTags
    : Promise.resolve();

  unregisterTags([`ma${id}`]).then(
    () => {
      dispatch(removeAlert(id));
      dispatch(setModifyingAlertStatus(false));
    },
    err => {
      dispatch(setError(err));
      dispatch(setModifyingAlertStatus(false));
    }
  );
});

export const toggleAlert = id => async (dispatch, getState) => {
  const {
    alerts: { alerts }
  } = getState();

  compose(
    dispatch,
    ifElse(contains(__, alerts), unRegisterAlert, registerAlert)
  )(id);
};

export const setMatchGroup = curry(
  async ({ selectedOption, url }, dispatch) => {
    // eslint-disable-next-line no-console
    const serverResponse = await getEventsData(url).catch(console.warn);
    const match = getMatchData(serverResponse, url);

    dispatch(
      setSelectedMatchGroup({
        [selectedOption]: match
      })
    );
  }
);
