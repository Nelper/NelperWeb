const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer-core');
const shared = require('./webpack-shared.js');
const commonLoaders = require('./common-loaders');

const ROOT_PATH = path.resolve(__dirname, '..');

module.exports = merge(shared.config, {
  debug: true,
  devtool: 'source-map',
  cache: true,
  entry: [
    'webpack/hot/dev-server',
  ],
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      include: path.resolve(ROOT_PATH, 'src'),
    }],
    loaders: commonLoaders.concat([{
      test: /\.css$/,
      loaders: ['style', 'css'],
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'postcss', 'sass?' + shared.sassPaths],
    }, {
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel?stage=0&optional=runtime'],
      include: path.resolve(ROOT_PATH, 'src'),
    }]),
  },
  postcss: [autoprefixer({browsers: ['last 2 versions']})],
  plugins: [
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__SERVER__': false,
      '__DEVELOPMENT__': true,
    }),
  ],
});