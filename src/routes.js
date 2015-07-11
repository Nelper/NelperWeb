import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import AppHandler from './components/AppHandler';
import HomeHandler from './components/HomeHandler';

export default (
  <Route name="app" path="/" handler={AppHandler}>
    <DefaultRoute name="home" handler={HomeHandler} />
  </Route>
);
