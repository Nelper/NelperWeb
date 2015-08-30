import React from 'react';
import {Route} from 'react-router';

import UserStore from 'stores/UserStore';

import AppHandler from 'handlers/AppHandler';
import PageNotFoundHandler from 'handlers/PageNotFoundHandler';

import HomeHandler from 'handlers/home/HomeHandler';

import NelpCenterHandler from 'handlers/nelpcenter/NelpCenterHandler';
import ApplicationsHandler from 'handlers/nelpcenter/ApplicationsHandler';
import TasksHandler from 'handlers/nelpcenter/TasksHandler';
import ProfileHandler from 'handlers/nelpcenter/ProfileHandler';
import TaskDetailHandler from 'handlers/nelpcenter/TaskDetailHandler';

import SettingsHandler from 'handlers/profile/SettingsHandler';

import TestPaymentHandler from 'handlers/nelpcenter/TestPaymentHandler';

/**
 * Allows chaining multiple handler functions for the onEnter prop.
 * The functions are executed in order.
 * If a function returns false, the next ones wont be executed.
 * @param  {Array<Function>} functions The handler functions to execute
 * @return {Function}                  The onEnter function
 */
/* function chain(...functions) {
  return (nextState, transition) => {
    for (const func of functions) {
      if (func(nextState, transition) === false) {
        return;
      }
    }
  };
}*/

// Pass this function to onEnter for a route that needs
// authentication to make sure the user is logged in.
function requireAuth(nextState, transition) {
  if (!UserStore.isLogged()) {
    transition.to('/login', null, { nextPathname: nextState.location.pathname });
    return false;
  }
  return true;
}

function getBrowseComponent(cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/browse/BrowseTasksHandler'));
  });
}

function getPostCategoriesComponent(cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/post/PostTaskCategoriesHandler'));
  });
}

function getPostFormComponent(cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/post/PostTaskFormHandler'));
  });
}

function getHowItWorksComponent(cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/about/HowItWorksHandler'));
  });
}

function getLoginComponent(cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/login/LoginHandler'));
  });
}

function getRegisterComponent(cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/login/RegisterHandler'));
  });
}

// Routes.
export default (
  <Route component={AppHandler}>
    <Route path="/" component={HomeHandler} />
    <Route path="/login" getComponents={getLoginComponent} />
    <Route path="/register" getComponents={getRegisterComponent} />
    <Route path="/browse" getComponents={getBrowseComponent} />
    <Route path="/post" getComponents={getPostCategoriesComponent} />
    <Route path="/post/:category" getComponents={getPostFormComponent} onEnter={requireAuth} />
    <Route path="/center" component={NelpCenterHandler} onEnter={requireAuth}>
      <Route path="applications" component={ApplicationsHandler} />
      <Route path="tasks" component={TasksHandler} />
      <Route path="tasks/detail/:id" component={TaskDetailHandler}  />
    </Route>
    <Route path="/center/profile" component={ProfileHandler} />
    <Route path="/settings" component={SettingsHandler} onEnter={requireAuth} />
    <Route path="/howitworks" getComponents={getHowItWorksComponent} />
    <Route path="/testpayment" component={TestPaymentHandler} />
    <Route path="*" component={PageNotFoundHandler} />
  </Route>
);
