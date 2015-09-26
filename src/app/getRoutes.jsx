import React from 'react';
import {Route, Redirect} from 'react-router';
import Relay from 'react-relay';

import Progress from 'components/Progress';

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
  TransactionHistoryHandler,
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

const TasksQueries = {
  me: () => Relay.QL`query { me }`,
};

const TaskDetailQueries = {
  task: () => Relay.QL`query { node(id: $taskId) }`,
};

const TaskDetailApplicationQueries = {
  application: () => Relay.QL`query { node(id: $applicationId) }`,
};

const ApplicationsQueries = {
  me: () => Relay.QL`query { me }`,
};

const ApplicationDetailQueries = {
  application: () => Relay.QL`query { node(id: $applicationId) }`,
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

function renderLoading() {
  return <div className="progress-center"><Progress /></div>;
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
      <Route
        path="/browse"
        component={BrowseTasksHandler}
        queries={BrowseQueries}
        renderLoading={renderLoading}
      />
      <Route path="/post" getComponent={getPostCategoriesComponent} />
      <Route path="/post/:category" getComponent={getPostFormComponent} onEnter={requireAuth} />
      <Route onEnter={requireAuth} name={IntlUtils.getMessage('routes.nelpcenter')}>
        <Route path="/center" component={NelpCenterHandler}>
          <Route
            path="applications"
            component={ApplicationsHandler}
            queries={ApplicationsQueries}
            renderLoading={renderLoading}
          />
          <Route
            path="tasks"
            component={TasksHandler}
            queries={TasksQueries}
            renderLoading={renderLoading}
          />
        </Route>
        <Route path="/center/tasks/detail/:taskId"
          component={TaskDetailHandler}
          name={IntlUtils.getMessage('routes.taskDetail')}
          queries={TaskDetailQueries}
          renderLoading={renderLoading}
        />
        <Route
          path="/center/tasks/detail/:taskId"
          name={IntlUtils.getMessage('routes.taskDetail')}
        >
          <Route
            path=":applicationId"
            component={TaskApplicationDetailHandler}
            name={IntlUtils.getMessage('routes.applicationDetail')}
            queries={TaskDetailApplicationQueries}
            renderLoading={renderLoading}
          />
        </Route>
        <Route
          path="/center/applications/detail/:applicationId"
          component={ApplicationDetailHandler}
          name={IntlUtils.getMessage('routes.applicationDetail')}
          queries={ApplicationDetailQueries}
          renderLoading={renderLoading}
        />
      </Route>
      <Route path="/profile" getComponent={getProfileComponent} onEnter={requireAuth} />
      <Redirect from="/settings" to="/settings/account"/>
      <Route path="/settings" component={SettingsHandler} onEnter={requireAuth}>
        <Route
          path="account"
          component={AccountSettingsHandler}
          queries={SettingsQueries}
          renderLoading={renderLoading}
        />
        <Route
          path="notifications"
          component={NotificationsSettingsHandler}
          queries={SettingsQueries}
          renderLoading={renderLoading}
        />
        <Route
          path="nelperpay"
          component={NelperPaySettingsHandler}
          queries={SettingsQueries}
          renderLoading={renderLoading}
        />
        <Route
          path="history"
          component={TransactionHistoryHandler}
          queries={SettingsQueries}
          renderLoading={renderLoading}
        />
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
