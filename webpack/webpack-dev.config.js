const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const shared = require('./webpack-shared.js');
const commonLoaders = require('./common-loaders');

const ROOT_PATH = path.resolve(__dirname, '..');

module.exports = merge(shared.config, {
  debug: true,
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack/hot/dev-server',
  ],
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      include: path.resolve(ROOT_PATH, 'src'),
      exclude: path.resolve(ROOT_PATH, 'node_modules'),
    }],
    loaders: commonLoaders.concat([{
      test: /\.css$/,
      loaders: ['style', 'css'],
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'postcss', 'sass?' + shared.sassPaths],
    }, {
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.resolve(ROOT_PATH, 'src'),
    }]),
  },
  postcss: [autoprefixer({browsers: ['last 1 Chrome versions']})],
  plugins: [
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__SERVER__': false,
      '__DEVELOPMENT__': true,
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
