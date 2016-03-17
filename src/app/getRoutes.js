import React from 'react';
import {Route, Redirect} from 'react-router';
import Relay from 'react-relay';
import {FormattedMessage} from 'react-intl';

import LoadingView from 'handlers/common/LoadingView';
import FailureView from 'handlers/common/FailureView';

import IntlUtils from 'utils/IntlUtils';

import UserStore from 'stores/UserStore';

import AppHandler from 'handlers/AppHandler';
import PageNotFoundHandler from 'handlers/PageNotFoundHandler';

import NelpCenterHandler from 'handlers/nelpcenter/home/NelpCenterHandler';
import ApplicationsHandler from 'handlers/nelpcenter/home/ApplicationsHandler';
import TasksHandler from 'handlers/nelpcenter/home/TasksHandler';
import TaskDetailHandler from 'handlers/nelpcenter/taskdetail/TaskDetailHandler';
import TaskApplicationDetailHandler from 'handlers/nelpcenter/taskdetail/TaskApplicationDetailHandler';
import ApplicationDetailHandler from 'handlers/nelpcenter/applicationdetail/ApplicationDetailHandler';
import ApplicationDetailProfileHandler from 'handlers/nelpcenter/applicationdetail/ApplicationDetailProfileHandler';

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

const ApplicationDetailProfileQueries = {
  application: () => Relay.QL`query { node(id: $applicationId) }`,
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
  return <LoadingView />;
}

function renderFailure(error, retry) {
  return (
    <FailureView onRetry={retry} />
  );
}

function getHomeComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/home/HomeHandler').default);
  });
}

function getBrowseComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/browse/BrowseTasksHandler').default);
  });
}

function getTaskPosterProfileComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/browse/TaskPosterProfileHandler').default);
  });
}

function getPostCategoriesComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/post/PostTaskCategoriesHandler').default);
  });
}

function getPostFormComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/post/PostTaskFormHandler').default);
  });
}

function getHowItWorksComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/about/HowItWorksHandler').default);
  });
}

function getLoginComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/login/LoginHandler').default);
  });
}

function getRegisterComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/login/RegisterHandler').default);
  });
}

function getProfileComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/profile/ProfileHandler').default);
  });
}

function getFAQComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/about/FAQHandler').default);
  });
}

function getNelperPayComponent(loc, cb) {
  require.ensure([], (require) => {
    cb(null, require('handlers/about/NelperPayHandler').default);
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
        path="/browse"
        getComponent={getBrowseComponent}
        forceFetch
        queries={BrowseQueries}
        renderLoading={renderLoading}
        renderFailure={renderFailure}
      />
      <Route
        breadcrumbs={[
          IntlUtils.getMessage('routes.browse'),
          IntlUtils.getMessage('routes.browseProfile'),
        ]}
        path="/browse/profile/:userId"
        getComponent={getTaskPosterProfileComponent}
        queries={TaskPosterProfileQueries}
        renderLoading={renderLoading}
        renderFailure={renderFailure}
      />
      <Route path="/post" getComponent={getPostCategoriesComponent} />
      <Route
        path="/post/:category"
        getComponent={getPostFormComponent}
        onEnter={requireAuth}
        queries={PostQueries}
        renderLoading={renderLoading}
        renderFailure={renderFailure}
      />
      <Route path="/center" component={NelpCenterHandler}>
        <Route
          path="applications"
          component={ApplicationsHandler}
          queries={ApplicationsQueries}
          renderLoading={renderLoading}
          renderFailure={renderFailure}
        />
        <Route
          path="tasks"
          component={TasksHandler}
          queries={TasksQueries}
          renderLoading={renderLoading}
          renderFailure={renderFailure}
        />
      </Route>
      <Route path="/center/tasks/detail/:taskId"
        breadcrumbs={[IntlUtils.getMessage('routes.nelpcenter'), IntlUtils.getMessage('routes.taskDetail')]}
        component={TaskDetailHandler}
        queries={TaskDetailQueries}
        renderLoading={renderLoading}
        renderFailure={renderFailure}
      />
      <Route
        breadcrumbs={[
          IntlUtils.getMessage('routes.nelpcenter'),
          IntlUtils.getMessage('routes.taskDetail'),
          IntlUtils.getMessage('routes.taskApplicationDetail'),
        ]}
        path="/center/tasks/detail/:taskId/:applicationId"
        component={TaskApplicationDetailHandler}
        queries={TaskDetailApplicationQueries}
        renderLoading={renderLoading}
        renderFailure={renderFailure}
      />
      <Route
        breadcrumbs={[IntlUtils.getMessage('routes.nelpcenter'), IntlUtils.getMessage('routes.applicationDetail')]}
        path="/center/applications/detail/:applicationId"
        component={ApplicationDetailHandler}
        queries={ApplicationDetailQueries}
        renderLoading={renderLoading}
        renderFailure={renderFailure}
      />
      <Route
        breadcrumbs={[
          IntlUtils.getMessage('routes.nelpcenter'),
          IntlUtils.getMessage('routes.applicationDetail'),
          IntlUtils.getMessage('routes.applicationDetailProfile'),
        ]}
        path="/center/applications/detail/:applicationId/profile"
        component={ApplicationDetailProfileHandler}
        queries={ApplicationDetailProfileQueries}
        renderLoading={renderLoading}
        renderFailure={renderFailure}
      />
      <Route
        path="/profile"
        getComponent={getProfileComponent}
        onEnter={requireAuth}
        queries={ProfileQueries}
        renderLoading={renderLoading}
        renderFailure={renderFailure}
      />
      <Redirect from="/settings" to="/settings/account"/>
      <Route path="/settings" component={SettingsHandler} onEnter={requireAuth}>
        <Route
          path="account"
          component={AccountSettingsHandler}
          queries={SettingsQueries}
          renderLoading={renderLoading}
          renderFailure={renderFailure}
        />
        <Route
          path="notifications"
          component={NotificationsSettingsHandler}
          queries={SettingsQueries}
          renderLoading={renderLoading}
          renderFailure={renderFailure}
        />
        <Route
          path="nelperpay"
          component={NelperPaySettingsHandler}
          queries={SettingsQueries}
          renderLoading={renderLoading}
          renderFailure={renderFailure}
        />
        <Route
          path="history"
          component={TransactionHistoryHandler}
          queries={SettingsQueries}
          renderLoading={renderLoading}
          renderFailure={renderFailure}
        />
      </Route>
      <Route path="/howitworks" getComponent={getHowItWorksComponent} />
      <Route path="/faq" getComponent={getFAQComponent} />
      <Route path="/nelperpay" getComponent={getNelperPayComponent} />
      <Route path="*" component={PageNotFoundHandler} />
    </Route>
  );
}
