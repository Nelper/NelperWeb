import React from 'react';
import {Route} from 'react-router';
import {Parse} from 'parse';

import AppHandler from './components/AppHandler';
import HomeHandler from './components/HomeHandler';
import LoginHandler from './components/LoginHandler';
import RegisterHandler from './components/RegisterHandler';
import NelpHandler from './components/NelpHandler';
import GetNelpHandler from './components/GetNelpHandler';
import ProfileHandler from './components/ProfileHandler';
import PageNotFoundHandler from './components/PageNotFoundHandler';

// Pass this function to onEnter for a route that needs
// authentication to make sure the user is logged in.
function requireAuth(nextState, transition) {
  if (!Parse.User.current()) {
    transition.to('/login', null, { nextPathname: nextState.location.pathname });
  }
}

// Routes.
export default (
  <Route name="app" component={AppHandler}>
    <Route path="/" component={HomeHandler} />
    <Route path="/login" component={LoginHandler} />
    <Route path="/register" component={RegisterHandler} />
    <Route path="/nelp" component={NelpHandler} onEnter={requireAuth} />
    <Route path="/getnelp" component={GetNelpHandler} onEnter={requireAuth} />
    <Route path="/profile" component={ProfileHandler} onEnter={requireAuth} />
    <Route path="*" component={PageNotFoundHandler} />
  </Route>
);
