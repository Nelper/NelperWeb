import path from 'path';
import express from 'express';
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import Parse from 'parse/node';
import cors from 'cors';

import config from './../../webpack/webpack-dev.config';
import template from './template';
import devTemplate from './devTemplate';
import graphql from './graphql';

global.__DEVELOPMENT__ = true;
global.__SERVER__ = true;
global.__CLIENT__ = true;

Parse.initialize(
  'w6MsLIhprn1GaHllI4WYa8zcLghnPUQi5jwe7FxN',
  'x6AWt2EdYFuK7HoDgQVI8xEJs6fsjcn3MHKr22si',
  'PjVCIvICgrOZjwSG5AiuKCjdyrzHjfalWbAK5mwR'
);

function client() {
  const compiledTemplate = template
    // Remove the stylesheet since styles will be inline in dev.
    .replace('<link href="{styles}" rel="stylesheet" type="text/css">', '')
    // Remove the shared script in dev because we dont use the chunk optimise plugin.
    .replace('<script src="{shared}"></script>', '')
    .replace('{main}', '/main.js')
    .replace('{content}', '');

  const app = express();
  const compiler = webpack(config);

  app.use(express.static(path.resolve(__dirname, '../static'), {index: false}));

  app.use(new WebpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));

  app.use(new WebpackHotMiddleware(compiler));

  app.get('/dev', (req, res) => {
    res.send(devTemplate);
  });

  app.get('*', (req, res) => {
    res.send(compiledTemplate);
  });

  app.listen(8080, 'localhost', (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Client listening at http://localhost:8080');
  });
}

function server() {
  const app = express();
  app.use(cors());
  graphql(app);
  app.listen(8081, 'localhost', (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Server listening at http://localhost:8081');
  });
}

if (process.argv[2] === '--server') {
  server();
} else if (process.argv[2] === '--client') {
  client();
} else {
  server();
  client();
}
