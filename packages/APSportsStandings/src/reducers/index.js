import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import filter from './filter';
import type from './type';
import standings from './standings';

export const INITIAL_STATE = {
  type: Immutable({ sport: 'us-sport' }),
  filter: Immutable({
    primarySelectedOption: '',
    secondarySelectedOption: 'all'
  }),
  standings: Immutable({ all: {}, home: {}, away: {} })
};

export const rootReducer = combineReducers({ filter, type, standings });
