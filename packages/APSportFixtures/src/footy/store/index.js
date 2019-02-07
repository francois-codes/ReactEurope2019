/* globals __DEV__ */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Reactotron from '../../../reactotronConfig';
import { rootReducer, INITIAL_STATE } from '../reducers';

const storeCreator = __DEV__ ? Reactotron.createStore : createStore;

export default storeCreator(rootReducer, INITIAL_STATE, applyMiddleware(thunk));
