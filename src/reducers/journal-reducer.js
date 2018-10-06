// Reducer for receiving and submitting journal entries
import Immutable from 'immutable';

import { ActionTypes } from '../actions';

let entryList, entryMap;


const initialState = {
  entries: [],
  dictionary: {},
};

const JournalReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ENTRIES:
      entryMap = Immutable.OrderedMap(action.payload.entries);
      entryList = [];
      console.log(action.payload.entries);
      entryMap.map((value, key) => {
        console.log(value);
        entryList.push(value);
        return null;
      });
      return Object.assign({}, state, {
        entries: entryList.reverse(),
        dictionary: action.payload.dictionary,
      });
    case ActionTypes.SUBMIT_ENTRY:
      return Object.assign({}, state, {
        entries: [action.payload.entry, ...state.entries],
      });
    default:
      return state;
  }
};

export default JournalReducer;
