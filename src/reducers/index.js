// Compiler for all reducers in ./reducers
import { combineReducers } from 'redux';

import AuthReducer from './auth-reducer';
import JournalReducer from './journal-reducer';

const rootReducer = combineReducers({
  journal: JournalReducer,
  auth: AuthReducer,
});

export default rootReducer;
