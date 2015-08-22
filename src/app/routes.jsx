import React from 'react';
import {Route} from 'react-router';

import UserStore from 'stores/UserStore';

import AppHandler from 'handlers/AppHandler';
import PageNotFoundHandler from 'handlers/PageNotFoundHandler';

import HomeHandler from 'handlers/home/HomeHandler';

import LoginHandler from 'handlers/login/LoginHandler';
import RegisterHandler from 'handlers/login/RegisterHandler';

import BrowseTasksHandler from 'handlers/browse/BrowseTasksHandler';

import PostTaskCategoriesHandler from 'handlers/post/PostTaskCategoriesHandler';
import PostTaskFormHandler from 'handlers/post/PostTaskFormHandler';

import NelpCenterHandler from 'handlers/nelpcenter/NelpCenterHandler';
import ApplicationsHandler from 'handlers/nelpcenter/ApplicationsHandler';
import TasksHandler from 'handlers/nelpcenter/TasksHandler';
import ProfileHandler from 'handlers/nelpcenter/ProfileHandler';
import TaskDetailHandler from 'handlers/nelpcenter/TaskDetailHandler';

import SettingsHandler from 'handlers/profile/SettingsHandler';

import HowItWorksHandler from 'handlers/about/HowItWorksHandler';

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

// Routes.
export default (
  <Route component={AppHandler}>
    <Route path="/" component={HomeHandler} />
    <Route path="/login" component={LoginHandler} />
    <Route path="/register" component={RegisterHandler} />
    <Route path="/browse" component={BrowseTasksHandler} />
    <Route path="/post" component={PostTaskCategoriesHandler} />
    <Route path="/post/:category" component={PostTaskFormHandler} onEnter={requireAuth} />
    <Route path="/center" component={NelpCenterHandler} onEnter={requireAuth}>
      <Route path="applications" component={ApplicationsHandler} />
      <Route path="tasks" component={TasksHandler} />
      <Route path="tasks/detail/:id" component={TaskDetailHandler}  />
    </Route>
    <Route path="/center/profile" component={ProfileHandler} />
    <Route path="/settings" component={SettingsHandler} onEnter={requireAuth} />
    <Route path="/howitworks" component={HowItWorksHandler} />
    <Route path="/testpayment" component={TestPaymentHandler} />
    <Route path="*" component={PageNotFoundHandler} />
  </Route>
);
