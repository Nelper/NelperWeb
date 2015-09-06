import 'babel-core/polyfill';
import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {Router} from 'react-router';
import Location from 'react-router/lib/Location';
import {IntlProvider} from 'react-intl';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {Parse} from 'parse';

import getRoutes from 'app/getRoutes';
import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';
import IntlUtils from 'utils/IntlUtils';
import formats from 'utils/IntlFormats';

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

const locale = 'fr-CA';

app.use(express.static(path.resolve(__dirname, '../../build/client'), {index: false}));

app.use(morgan('combined'));
app.use(cookieParser());

app.use((req, res, next) => {
  function renderPage(messages) {
    const location = new Location(req.path, req.query);
    Router.run(getRoutes(), location, (error, initialState, transition) => {
      if (error) {
        return next(error);
      }
      if (transition.isCancelled && transition.redirectInfo) {
        return res.redirect(transition.redirectInfo.pathname);
      }
      const html = ReactDOMServer.renderToString(
        <Router location={location} createElement={(Component, props) => {
          return (
            <IntlProvider locale={locale} messages={messages} formats={formats}>
              <Component {...props} />
            </IntlProvider>
          );
        }} {...initialState} />
      );
      alt.flush();
      return res.send(htmlTemplate.replace('{content}', html));
    });
  }

  const parseToken = req.cookies.p_session;
  const parseUser = req.cookies.p_user;

  IntlUtils.init(locale).then((messages) => {
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
          renderPage(messages);
        }, (err) => {
          console.log(err);
          renderPage(messages);
        });
    } else {
      renderPage(messages);
    }
  })
  .catch(err => console.error(err));
});

app.listen(port);
