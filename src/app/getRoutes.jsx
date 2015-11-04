import React from 'react';
import {Route, Redirect} from 'react-router';
import Relay from 'react-relay';

import Progress from 'components/Progress';

import IntlUtils from 'utils/IntlUtils';

import UserStore from 'stores/UserStore';

import AppHandler from 'handlers/AppHandler';
import PageNotFoundHandler from 'handlers/PageNotFoundHandler';

import BrowseTasksHandler from 'handlers/browse/BrowseTasksHandler';
import TaskPosterProfileHandler from 'handlers/browse/TaskPosterProfileHandler';

import NelpCenterHandler from 'handlers/nelpcenter/home/NelpCenterHandler';
import ApplicationsHandler from 'handlers/nelpcenter/home/ApplicationsHandler';
import TasksHandler from 'handlers/nelpcenter/home/TasksHandler';
import TaskDetailHandler from 'handlers/nelpcenter/taskdetail/TaskDetailHandler';
import TaskApplicationDetailHandler from 'handlers/nelpcenter/taskdetail/TaskApplicationDetailHandler';
import ApplicationDetailHandler from 'handlers/nelpcenter/applicationdetail/ApplicationDetailHandler';

import PostTaskCategoriesHandler from 'handlers/post/PostTaskCategoriesHandler';
import PostTaskFormHandler from 'handlers/post/PostTaskFormHandler';

import ProfileHandler from 'handlers/profile/ProfileHandler';

import {
  SettingsHandler,
  AccountSettingsHandler,
  NotificationsSettingsHandler,
  NelperPaySettingsHandler,
  TransactionHistoryHandler,
} from 'handlers/settings/index';

const AppQueries = {
  me: () => Relay.QL`query { me }`,
};

const BrowseQueries = {
  me: () => Relay.QL`query { me }`,
  browse: () => Relay.QL`query { browse }`,
};

const TaskPosterProfileQueries = {
  user: () => Relay.QL`query { node(id: $userId) }`,
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
  me: () => Relay.QL`query { me }`,
};

const PostQueries = {
  me: () => Relay.QL`query { me }`,
};

const ProfileQueries = {
  me: () => Relay.QL`query { me }`,
};

// Pass this function to onEnter for a route that needs
// authentication to make sure the user is logged in.
function requireAuth(nextState, transition) {
  if (!UserStore.isLogged()) {
    transition({ nextPathname: nextState.location.pathname }, '/login');
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
}

function getPostCategoriesComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/post/PostTaskCategoriesHandler'));
  });
} */

/* function getPostFormComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/post/PostTaskFormHandler'));
  });
}*/

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

/* function getProfileComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/profile/ProfileHandler'));
  });
}*/

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
    <Route
      component={AppHandler}
      queries={AppQueries}
    >
      <Route path="/" getComponent={getHomeComponent} />
      <Route path="/login" getComponent={getLoginComponent} />
      <Route path="/register" getComponent={getRegisterComponent} />
      <Route
        name={IntlUtils.getMessage('routes.browse')}
        path="/browse"
        component={BrowseTasksHandler}
        forceFetch
        queries={BrowseQueries}
        renderLoading={renderLoading}
      />
      <Route
        name={IntlUtils.getMessage('routes.browse')}
        path="/browse/profile"
      >
        <Route
          name={IntlUtils.getMessage('routes.browseProfile')}
          path=":userId"
          component={TaskPosterProfileHandler}
          queries={TaskPosterProfileQueries}
          renderLoading={renderLoading}
        />
      </Route>
      <Route path="/post" component={PostTaskCategoriesHandler} />
      <Route
        path="/post/:category"
        component={PostTaskFormHandler}
        onEnter={requireAuth}
        queries={PostQueries}
        renderLoading={renderLoading}
      />
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
            name={IntlUtils.getMessage('routes.taskApplicationDetail')}
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
      <Route
        path="/profile"
        component={ProfileHandler}
        onEnter={requireAuth}
        queries={ProfileQueries}
        renderLoading={renderLoading}
      />
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
      <Route path="*" component={PageNotFoundHandler} />
    </Route>
  );
}
