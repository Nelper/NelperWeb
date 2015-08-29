import express from 'express';
import path from 'path';
import React from 'react';
import {Router} from 'react-router';
import Location from 'react-router/lib/Location';

import routes from 'app/routes';

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
    <script src="/bundle.js"></script>
  </body>
</html>`;

app.use(express.static(path.resolve(__dirname, '../../build/client'), {index: false}));

app.use((req, res) => {
  const location = new Location(req.path, req.query);
  Router.run(routes, location, (error, initialState) => {
    // TODO: handle errors.
    const html = React.renderToString(<Router location={location} {...initialState} />);

    return res.send(htmlTemplate.replace('{content}', html));
  });
});

app.listen(port);
