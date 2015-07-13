import React from 'react';
import {Route} from 'react-router';
import {Parse} from 'parse';

import AppHandler from './components/AppHandler';
import HomeHandler from './components/HomeHandler';
import LoginHandler from './components/LoginHandler';
import RegisterHandler from './components/RegisterHandler';
import PageNotFoundHandler from './components/PageNotFoundHandler';

import NelpHandler from './components/NelpHandler';
import NelpDetailHandler from './components/NelpDetailHandler';

import FindNelpHandler from './components/FindNelpHandler';
import FindNelpAddHandler from './components/FindNelpAddHandler';
import FindNelpDetailHandler from './components/FindNelpDetailHandler';

import ProfileHandler from './components/ProfileHandler';



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
    <Route path="/nelp/detail/:id" component={NelpDetailHandler} />
    <Route path="/findnelp" component={FindNelpHandler} onEnter={requireAuth} />
    <Route path="/findnelp/add" component={FindNelpAddHandler} />
    <Route path="/findnelp/detail/:id" component={FindNelpDetailHandler} />
    <Route path="/profile" component={ProfileHandler} onEnter={requireAuth} />
    <Route path="*" component={PageNotFoundHandler} />
  </Route>
);
