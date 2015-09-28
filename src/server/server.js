/**
 * Production server. Serves assets prebuilt in the build directory by webpack,
 * graphql, prerendered react pages and special api routes.
 *
 * Support for server side rendering is done but disabled at the moment due to
 * fetch polyfill in relay not working in node. Once this is fixed, it should be
 * reenabled.
 *
 * Static assets can be served from this server but should be used with a CDN.
 * Assets are long term cached and invalidated using a hash in the name.
 *
 * Runs on the PORT env variable or 8080.
 * This should eventually be split into multiple services behind a load balancer.
 */
import fs from 'fs';
import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {RoutingContext, match} from 'react-router';
import createLocation from 'history/lib/createLocation';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import Parse from 'parse/node';

// import getRoutes from 'app/getRoutes';
import alt from 'app/alt';
import ApiUtils from 'utils/ServerApiUtils';
import IntlUtils from 'utils/IntlUtils';
import formats from 'utils/IntlFormats';
import graphql from './graphql';
import {processStripeEvent} from './data/paymentData';

import template from './template';

const app = express();
const port = process.env.PORT || 8080;

const assets = JSON.parse(fs.readFileSync(path.resolve(__dirname, './assets.json'), 'utf8'));

const compiledTemplate = template
  .replace('{styles}', assets.main.css)
  .replace('{shared}', assets.shared.js)
  .replace('{main}', assets.main.js);

Parse.initialize(
  'w6MsLIhprn1GaHllI4WYa8zcLghnPUQi5jwe7FxN',
  'x6AWt2EdYFuK7HoDgQVI8xEJs6fsjcn3MHKr22si',
  'PjVCIvICgrOZjwSG5AiuKCjdyrzHjfalWbAK5mwR'
);

graphql(app);

app.use(compression());
app.use(express.static(path.resolve(__dirname, '../../build/client'), {maxAge: 30 * 24 * 60 * 60 * 1000, index: false}));

app.use(morgan('combined'));
app.use(cookieParser());

// Stripe webhook.
app.post('/api/stripe', async (req, res) => {
  const event = JSON.parse(req.body);

  try {
    await processStripeEvent(event);
  } catch (err) {
    console.error(err.stack);
    // If there is an error stripe will resend the event if we send a > 300 code.
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});

app.use((req, res, next) => {
  if (__DISABLE_SSR__) {
    return res.send(compiledTemplate.replace('{content}', ''));
  }

  function renderPage(messages, locale) {
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
      return res.send(compiledTemplate.replace('{content}', html));
    });
  }

  function loadLocale(locale) {
    IntlUtils.init(locale).then((messages) => {
      renderPage(messages, locale);
    })
    .catch(err => console.error(err.stack));
  }

  function getReqLang() {
    try {
      return req.acceptsLanguages[0].split('-')[0];
    } catch (e) {
      return 'en';
    }
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
        loadLocale(user.privateData.language || getReqLang());
      }, (err) => {
        console.log(err);
        loadLocale(getReqLang());
      });
  } else {
    loadLocale(getReqLang());
  }
});

app.listen(port);
