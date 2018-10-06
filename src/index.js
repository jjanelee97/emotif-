import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'es6-shim';
import firebase from 'firebase';

// import 'babel-polyfill';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import ActionTypes from './actions';
import App from './components/app';
import reducers from './reducers';


const config = {
  apiKey: 'AIzaSyBW06vVbfjSkIjGyL8hmxnD4UY5jl0I404',
  authDomain: 'emotif-journal-app.firebaseapp.com',
  databaseURL: 'https://emotif-journal-app.firebaseio.com',
  projectId: 'emotif-journal-app',
  storageBucket: 'emotif-journal-app.appspot.com',
  messagingSenderId: '540036898117',
};

firebase.initializeApp(config);

const store = createStore(reducers, {}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));


const token = localStorage.getItem('token');
if (token) {
  store.dispatch({ type: ActionTypes.AUTH_USER });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('main'),
);
