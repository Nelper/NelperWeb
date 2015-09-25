const webpack = require('webpack');
const path = require('path');
const neat = require('node-neat');

const ROOT_PATH = path.resolve(__dirname, '..');

const common = {
  name: 'client',
  entry: [path.resolve(ROOT_PATH, 'src/app/main')],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(ROOT_PATH, 'src'),
  },
  output: {
    path: path.resolve(ROOT_PATH, 'build/client'),
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
  ],
};

const sassNeatPaths = neat.with([
  path.resolve(ROOT_PATH, './src'),
  path.resolve(ROOT_PATH, './node_modules'),
]).map((neatPath) => {
  return 'includePaths[]=' + neatPath;
}).join('&');

module.exports.config = common;
module.exports.sassPaths = sassNeatPaths;
