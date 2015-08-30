import React from 'react';
import {Router} from 'react-router';
import {history} from 'react-router/lib/BrowserHistory';
import {Parse} from 'parse';

import routes from './routes';

import 'normalize.css/normalize.css';
import 'styles/common.scss';

// Initialize Parse
Parse.initialize('w6MsLIhprn1GaHllI4WYa8zcLghnPUQi5jwe7FxN', 'x6AWt2EdYFuK7HoDgQVI8xEJs6fsjcn3MHKr22si');

window.fbAsyncInit = () => {
  Parse.FacebookUtils.init({
    appId: '1446755655626296',  // Facebook App ID
    cookie: true,               // enable cookies to allow Parse to access the session
    xfbml: true,                // initialize Facebook social plugins on the page
    version: 'v2.3',
  });
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

// Render the app!
React.render((
  <Router history={history}>
    {routes}
  </Router>
), document.getElementById('app'));
