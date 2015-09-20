import express from 'express';
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import Parse from 'parse/node';

import config from './../../webpack/webpack-dev.config';
import template from './template';
import graphql from './graphql';

const app = express();
const compiler = webpack(config);

Parse.initialize(
  'w6MsLIhprn1GaHllI4WYa8zcLghnPUQi5jwe7FxN',
  'x6AWt2EdYFuK7HoDgQVI8xEJs6fsjcn3MHKr22si',
  'PjVCIvICgrOZjwSG5AiuKCjdyrzHjfalWbAK5mwR'
);

graphql(app);

app.use(new WebpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

app.use(new WebpackHotMiddleware(compiler));

app.get('*', (req, res) => {
  res.send(template.replace('{content}', ''));
});

app.listen(8080, 'localhost', (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:8080');
});
