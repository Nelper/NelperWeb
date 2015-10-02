import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {Router} from 'react-router';
import ReactRouterRelay from 'react-router-relay';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {Parse} from 'parse';

import IntlUtils from 'utils/IntlUtils';
import LogUtils from 'utils/LogUtils';
import ApiUtils from 'utils/ApiUtils';
import getRoutes from './getRoutes';
import formats from 'utils/IntlFormats';
import Storage from 'utils/Storage';

import 'normalize.css/normalize.css';
import 'styles/common.scss';
import 'file?name=[name].[ext]!images/favicon.ico';

// Initialize Parse
Parse.initialize('w6MsLIhprn1GaHllI4WYa8zcLghnPUQi5jwe7FxN', 'x6AWt2EdYFuK7HoDgQVI8xEJs6fsjcn3MHKr22si');

const headers = {};
const session = ApiUtils.getUserSession();
if (session) {
  headers.Authorization = session;
}
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    headers,
  })
);

function getBrowserLang() {
  try {
    return navigator.language.split('-')[0];
  } catch (e) {
    return 'en';
  }
}

// Get the language.
const lang = Storage.getItem('lang') || getBrowserLang();
// Force Canada locale.
const locale = lang + '-CA';

let facebookLoaded = false;
let intlDataLoaded = false;
let messages;

function renderApp() {
  // Makes sure we have loaded everything we need before the first render.
  if (!facebookLoaded || !intlDataLoaded) {
    return;
  }

  // Render the app!
  ReactDOM.render((
    <Router history={createBrowserHistory()} createElement={(Component, props) => {
      return ReactRouterRelay.createElement(
        Component, {
          ...props,
          messages,
          locale,
          formats,
        },
      );
    }}>
      {getRoutes()}
    </Router>
  ), document.getElementById('app'));
}

IntlUtils.init(locale).then((m) => {
  intlDataLoaded = true;
  messages = m;
  renderApp();
});

LogUtils.init();

window.fbAsyncInit = () => {
  Parse.FacebookUtils.init({
    appId: '1446755655626296',  // Facebook App ID
    cookie: true,               // enable cookies to allow Parse to access the session
    xfbml: true,                // initialize Facebook social plugins on the page
    version: 'v2.4',
  });

  facebookLoaded = true;
  renderApp();
};

// Get Facebook SDK.
((d, s, id) => {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  const js = d.createElement(s);
  js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
