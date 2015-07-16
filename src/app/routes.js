import React from 'react';
import {Route} from 'react-router';
import {Parse} from 'parse';

import AppHandler from 'handlers/AppHandler';
import PageNotFoundHandler from 'handlers/PageNotFoundHandler';

import HomeHandler from 'handlers/home/HomeHandler';
import LoginHandler from 'handlers/login/LoginHandler';
import RegisterHandler from 'handlers/login/RegisterHandler';

import NelpHandler from 'handlers/nelp/NelpHandler';
import NelpDetailHandler from 'handlers/nelp/NelpDetailHandler';

import FindNelpHandler from 'handlers/findnelp/FindNelpHandler';
import FindNelpAddHandler from 'handlers/findnelp/FindNelpAddHandler';
import FindNelpDetailHandler from 'handlers/findnelp/FindNelpDetailHandler';

import ProfileHandler from 'handlers/profile/ProfileHandler';



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
