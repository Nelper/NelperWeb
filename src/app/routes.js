import React from 'react';
import {Route} from 'react-router';

import UserStore from 'stores/UserStore';

import AppHandler from 'handlers/AppHandler';
import PageNotFoundHandler from 'handlers/PageNotFoundHandler';

import HomeHandler from 'handlers/home/HomeHandler';

import LoginHandler from 'handlers/login/LoginHandler';
import RegisterHandler from 'handlers/login/RegisterHandler';

import NelpHandler from 'handlers/nelp/NelpHandler';

import FindNelpAddHandler from 'handlers/findnelp/FindNelpAddHandler';

import NelpCenterHandler from 'handlers/nelpcenter/NelpCenterHandler';
import ApplicationsHandler from 'handlers/nelpcenter/ApplicationsHandler';
import TasksHandler from 'handlers/nelpcenter/TasksHandler';
import ProfileHandler from 'handlers/nelpcenter/ProfileHandler';
import FindNelpDetailHandler from 'handlers/nelpcenter/FindNelpDetailHandler';

import SettingsHandler from 'handlers/profile/SettingsHandler';

import HowItWorksHandler from 'handlers/about/HowItWorksHandler';


// Pass this function to onEnter for a route that needs
// authentication to make sure the user is logged in.
function requireAuth(nextState, transition) {
  if (!UserStore.state.user) {
    transition.to('/login', null, { nextPathname: nextState.location.pathname });
  }
}

// Routes.
export default (
  <Route component={AppHandler}>
    <Route path="/" component={HomeHandler} />
    <Route path="/login" component={LoginHandler} />
    <Route path="/register" component={RegisterHandler} />
    <Route path="/nelp" component={NelpHandler} />
    <Route path="/findnelp" component={FindNelpAddHandler} onEnter={requireAuth} />
    <Route path="/center" component={NelpCenterHandler} onEnter={requireAuth}>
      <Route path="applications" component={ApplicationsHandler} />
      <Route path="tasks" component={TasksHandler} />
      <Route path="tasks/detail/:id" component={FindNelpDetailHandler}  />
      <Route path="profile" component={ProfileHandler} />
    </Route>
    <Route path="/profile" component={ProfileHandler} onEnter={requireAuth} />
    <Route path="/profile/settings" component={SettingsHandler} onEnter={requireAuth} />
    <Route path="/howitworks" component={HowItWorksHandler} />
    <Route path="*" component={PageNotFoundHandler} />
  </Route>
);
