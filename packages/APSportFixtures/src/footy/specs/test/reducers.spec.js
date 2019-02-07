import Immutable from 'seamless-immutable';
import { NativeModules } from 'react-native'; // eslint-disable-line
import filter from '../../reducers/filter';
import alerts from '../../reducers/alerts';
import {
  setPrimaryFilterOption,
  setModifyingAlertStatus,
  setError,
  setAlerts,
  addAlert,
  removeAlert
} from '../../actions';

jest.mock('NativeModules', () => ({
  PushNotifications: { getRegisteredTags: jest.fn() }
}));

describe('filter', () => {
  it('should handle SET_PRIMARY_FILTER_OPTION', () => {
    expect(filter('Test', setPrimaryFilterOption)).toEqual('Test');
  });
});

describe('alerts', () => {
  const initialState = Immutable({
    alerts: [],
    error: null,
    isModifying: false
  });

  it('Should set correct isAddingAlertStatus', () => {
    const expectedState = Immutable({
      alerts: [],
      error: null,
      isModifying: true
    });

    expect(alerts(initialState, setModifyingAlertStatus(true))).toEqual(
      expectedState
    );
  });

  it('Should set correct setError', () => {
    const expectedState = Immutable({
      alerts: [],
      error: 'error',
      isModifying: false
    });

    expect(alerts(initialState, setError('error'))).toEqual(expectedState);
  });

  it('Should set correct setError', () => {
    const expectedState = Immutable({
      alerts: ['1', '2', '3'],
      error: null,
      isModifying: false
    });

    expect(alerts(initialState, setAlerts(['1', '2', '3']))).toEqual(
      expectedState
    );
  });

  it('Should addAlert', () => {
    const expectedState = Immutable({
      alerts: ['1'],
      error: null,
      isModifying: false
    });
    expect(alerts(initialState, addAlert('1'))).toEqual(expectedState);
  });

  it('Should remove alert', () => {
    const expectedState = Immutable({
      alerts: ['2'],
      error: null,
      isModifying: false
    });
    // Add alert
    expect(
      alerts(initialState.set('alerts', [1, '2']), removeAlert(1))
    ).toEqual(expectedState);
  });
});
