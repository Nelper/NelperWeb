import 'babel-core/polyfill';
import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {RoutingContext, match} from 'react-router';
import createLocation from 'history/lib/createLocation';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {Parse} from 'parse';

import getRoutes from 'app/getRoutes';
import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';
import IntlUtils from 'utils/IntlUtils';
import formats from 'utils/IntlFormats';

import template from './template';

const app = express();
const port = process.env.PORT || 8080;

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
    const location = createLocation(req.url);
    match({routes: getRoutes(), location}, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        return res.redirect(redirectLocation.pathname + redirectLocation.search);
      }
      if (error) {
        return next(error);
      }
      const html = ReactDOMServer.renderToString(
        <RoutingContext createElement={(Component, props) => {
          return (
            <Component {...props} messages={messages} locale={locale} formats={formats} />
          );
        }} {...renderProps} />
      );
      alt.flush();
      return res.send(template.replace('{content}', html));
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
