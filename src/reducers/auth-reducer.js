// A reducer for signing in and out users
import { ActionTypes } from '../actions';

const AuthReducer = (state = { authenticated: false, user: null }, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_USER:
      return { authenticated: true, user: action.payload.user };
    case ActionTypes.DEAUTH_USER:
      return { authenticated: false, user: null };
    case ActionTypes.AUTH_ERROR:
      return { authenticated: false, user: null };
    default:
      return state;
  }
};

export default AuthReducer;
