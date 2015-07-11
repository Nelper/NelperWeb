import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import {Parse} from 'parse';

import AppHandler from './components/AppHandler';
import HomeHandler from './components/HomeHandler';
import LoginHandler from './components/LoginHandler';
import NelpHandler from './components/NelpHandler';

function requireAuth(nextState, transition) {
  if (!Parse.User.current()) {
    transition.to('/login', null, { nextPathname: nextState.location.pathname });
  }
}

export default (
  <Route name="app" path="/" handler={AppHandler}>
    <DefaultRoute name="home" handler={HomeHandler} />
    <Route name="login" path="/login" handler={LoginHandler} />
    <Route name="nelp" path="/nelp" handler={NelpHandler} onEnter={requireAuth} />
  </Route>
);
