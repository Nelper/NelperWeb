import 'babel/polyfill';
import express from 'express';
import path from 'path';
import React from 'react';
import {Router} from 'react-router';
import Location from 'react-router/lib/Location';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {Parse} from 'parse';

import routes from 'app/routes';
import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

const app = express();
const port = process.env.PORT || 8080;

const htmlTemplate =
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <title>Nelper</title>
    <link rel="shortcut icon" href="/favicon.ico">
    <link href="/styles.css" rel="stylesheet">
  </head>
  <body>
    <div id="app" class="main-app">{content}</div>
    <div id="fb-root"></div>
    <script src="/shared.js"></script>
    <script src="/main.js"></script>
  </body>
</html>`;

Parse.initialize(
  'w6MsLIhprn1GaHllI4WYa8zcLghnPUQi5jwe7FxN',
  'x6AWt2EdYFuK7HoDgQVI8xEJs6fsjcn3MHKr22si',
  'PjVCIvICgrOZjwSG5AiuKCjdyrzHjfalWbAK5mwR'
);

app.use(cookieParser());
app.use(morgan('combined'));

app.use(express.static(path.resolve(__dirname, '../../build/client'), {index: false}));

app.use((req, res, next) => {
  function renderPage() {
    const location = new Location(req.path, req.query);
    Router.run(routes, location, (error, initialState, transition) => {
      if (error) {
        return next(error);
      }
      if (transition.isCancelled && transition.redirectInfo) {
        return res.redirect(transition.redirectInfo.pathname);
      }
      const html = React.renderToString(<Router location={location} {...initialState} />);
      alt.flush();
      return res.send(htmlTemplate.replace('{content}', html));
    });
  }

  const parseToken = req.cookies.p_session;
  const parseUser = req.cookies.p_user;

  // If the user is logged get it from parse.
  // TODO: Serialize the user store to use it directly on the client.
  if (parseToken && parseUser) {
    ApiUtils.becomeUser(parseUser, parseToken)
      .then((user) => {
        alt.bootstrap(JSON.stringify({
          UserStore: {
            user,
          },
        }));
        renderPage();
      }, (err) => {
        console.log(err);
        renderPage();
      });
  } else {
    renderPage();
  }
});

app.listen(port);
