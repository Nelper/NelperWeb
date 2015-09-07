const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
  ],
};

const sassNeatPaths = neat.with([
  path.resolve(ROOT_PATH, './src'),
  path.resolve(ROOT_PATH, './node_modules'),
]).map(function(neatPath) {
  return 'includePaths[]=' + neatPath;
}).join('&');

module.exports.config = common;
module.exports.sassPaths = sassNeatPaths;
