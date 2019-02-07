import { NativeModules } from 'react-native'; // eslint-disable-line
import {
  SET_PRIMARY_FILTER_OPTION,
  SET_MODIFYING_ALERT_STATUS,
  SET_ERROR,
  SET_ALERTS,
  ADD_ALERT,
  REMOVE_ALERT,
  setPrimaryFilterOption,
  setModifyingAlertStatus,
  setError,
  setAlerts,
  addAlert,
  removeAlert
} from '../../actions';

jest.mock('NativeModules', () => ({
  PushNotifications: {
    getRegisteredTags: jest.fn()
  }
}));

describe('actions', () => {
  it('Should create an action to set the filter option', () => {
    const expectedAction = {
      type: SET_PRIMARY_FILTER_OPTION,
      payload: {
        primarySelectedOption: 'Test'
      }
    };
    expect(setPrimaryFilterOption({ primarySelectedOption: 'Test' })).toEqual(
      expectedAction
    );
  });

  it('Should create an action to set the alert adding status', () => {
    const expectedAction = {
      type: SET_MODIFYING_ALERT_STATUS,
      payload: true
    };
    expect(setModifyingAlertStatus(true)).toEqual(expectedAction);
  });

  it('Should create an action to set the alerts error', () => {
    const expectedAction = {
      type: SET_ERROR,
      payload: 'something went wrong'
    };
    expect(setError('something went wrong')).toEqual(expectedAction);
  });

  it('Should create an action to add alert', () => {
    const expectedAction = {
      type: ADD_ALERT,
      payload: '1'
    };
    expect(addAlert('1')).toEqual(expectedAction);
  });

  it('Should create an action to remove alert', () => {
    const expectedAction = {
      type: REMOVE_ALERT,
      payload: '1'
    };
    expect(removeAlert('1')).toEqual(expectedAction);
  });

  it('Should create an action to set alerts list', () => {
    const expectedAction = {
      type: SET_ALERTS,
      payload: ['1']
    };
    expect(setAlerts(['1'])).toEqual(expectedAction);
  });
});
