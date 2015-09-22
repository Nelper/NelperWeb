import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Relay from 'react-relay';

import IntlUtils from 'utils/IntlUtils';

import UserStore from 'stores/UserStore';

import AppHandler from 'handlers/AppHandler';
import PageNotFoundHandler from 'handlers/PageNotFoundHandler';

import BrowseTasksHandler from 'handlers/browse/BrowseTasksHandler';

import NelpCenterHandler from 'handlers/nelpcenter/NelpCenterHandler';
import ApplicationsHandler from 'handlers/nelpcenter/ApplicationsHandler';
import TasksHandler from 'handlers/nelpcenter/TasksHandler';
import TaskDetailHandler from 'handlers/nelpcenter/TaskDetailHandler';
import TaskApplicationDetailHandler from 'handlers/nelpcenter/TaskApplicationDetailHandler';
import ApplicationDetailHandler from 'handlers/nelpcenter/ApplicationDetailHandler';

import {
  SettingsHandler,
  AccountSettingsHandler,
  NotificationsSettingsHandler,
  NelperPaySettingsHandler,
} from 'handlers/settings/index';

import LogoutHandler from 'handlers/login/LogoutHandler';

import TestPaymentHandler from 'handlers/nelpcenter/TestPaymentHandler';
import GraphiQLHandler from 'handlers/dev/GraphiQLHandler';

const BrowseQueries = {
  browse: () => Relay.QL`query { browse }`,
};

const SettingsQueries = {
  user: () => Relay.QL`query { me }`,
};

// Pass this function to onEnter for a route that needs
// authentication to make sure the user is logged in.
function requireAuth(nextState, transition) {
  if (!UserStore.isLogged()) {
    transition.to('/login', null, { nextPathname: nextState.location.pathname });
    return false;
  }
  return true;
}

function getHomeComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/home/HomeHandler'));
  });
}

/* function getBrowseComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/browse/BrowseTasksHandler'));
  });
} */

function getPostCategoriesComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/post/PostTaskCategoriesHandler'));
  });
}

function getPostFormComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/post/PostTaskFormHandler'));
  });
}

function getHowItWorksComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/about/HowItWorksHandler'));
  });
}

function getLoginComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/login/LoginHandler'));
  });
}

function getRegisterComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/login/RegisterHandler'));
  });
}

function getProfileComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/profile/ProfileHandler'));
  });
}

function getFAQComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/about/FAQHandler'));
  });
}

function getNelperPayComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/about/NelperPayHandler'));
  });
}

// Routes.
export default function getRoutes() {
  return (
    <Route component={AppHandler}>
      <Route path="/" getComponent={getHomeComponent} />
      <Route path="/login" getComponent={getLoginComponent} />
      <Route path="/register" getComponent={getRegisterComponent} />
      <Route path="/logout" component={LogoutHandler} />
      <Route path="/browse" queries={BrowseQueries} component={BrowseTasksHandler} />
      <Route path="/post" getComponent={getPostCategoriesComponent} />
      <Route path="/post/:category" getComponent={getPostFormComponent} onEnter={requireAuth} />
      <Route onEnter={requireAuth} name={IntlUtils.getMessage('routes.nelpcenter')}>
        <Route path="/center" component={NelpCenterHandler}>
          <Route path="applications" component={ApplicationsHandler} />
          <Route path="tasks" component={TasksHandler} />
        </Route>
        <Route path="/center/tasks/detail/:id" component={TaskDetailHandler} name={IntlUtils.getMessage('routes.taskDetail')} />
        <Route path="/center/tasks/detail/:taskId" name={IntlUtils.getMessage('routes.taskDetail')}>
          <Route
            path=":applicationId"
            component={TaskApplicationDetailHandler}
            name={IntlUtils.getMessage('routes.applicationDetail')}
          />
        </Route>
        <Route path="/center/applications/detail/:id" component={ApplicationDetailHandler} name={IntlUtils.getMessage('routes.applicationDetail')} />
      </Route>
      <Route path="/profile" getComponent={getProfileComponent} onEnter={requireAuth} />
      <Route path="/settings" component={SettingsHandler} onEnter={requireAuth}>
        <Route path="account" component={AccountSettingsHandler} queries={SettingsQueries} />
        <Route path="notifications" component={NotificationsSettingsHandler} queries={SettingsQueries} />
        <Route path="nelperpay" component={NelperPaySettingsHandler} queries={SettingsQueries} />
      </Route>
      <Route path="/howitworks" getComponent={getHowItWorksComponent} />
      <Route path="/faq" getComponent={getFAQComponent} />
      <Route path="/nelperpay" getComponent={getNelperPayComponent} />
      {
        __DEVELOPMENT__ ?
        <Route>
          <Route path="/dev/graphiql" component={GraphiQLHandler} />
          <Route path="/dev/testpayment" component={TestPaymentHandler} />
        </Route> :
        null
      }
      <Route path="*" component={PageNotFoundHandler} />
    </Route>
  );
}
