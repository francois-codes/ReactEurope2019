import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import filter from './filter';
import matches from './matches';
import alerts from './alerts';

export const INITIAL_STATE = {
  filter: Immutable({
    primarySelectedOption: '',
    secondarySelectedOption: 'today'
  }),
  matches: Immutable({}),
  alerts: Immutable({
    alerts: [],
    error: null,
    isModifying: false,
    isLoading: false
  })
};

export const rootReducer = combineReducers({ filter, matches, alerts });
