import React from 'react';
import Router from 'react-router';
import {Parse} from 'parse';

import routes from './routes';

import './styles/bootstrap.scss';
import './styles/global.scss';

// Initialize Parse
Parse.initialize('w6MsLIhprn1GaHllI4WYa8zcLghnPUQi5jwe7FxN', 'x6AWt2EdYFuK7HoDgQVI8xEJs6fsjcn3MHKr22si');

window.fbAsyncInit = function() {
  Parse.FacebookUtils.init({ // this line replaces FB.init({
    appId: '1446755655626296', // Facebook App ID
    status: true,  // check Facebook Login status
    cookie: true,  // enable cookies to allow Parse to access the session
    xfbml: true,  // initialize Facebook social plugins on the page
    version: 'v2.4', // point to the latest Facebook Graph API version
  });

  // Run code after the Facebook SDK is loaded.
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

Router.run(routes, (Handler) => {
  React.render(<Handler />, document.body);
});
