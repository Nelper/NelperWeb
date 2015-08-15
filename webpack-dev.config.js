var path = require('path');
var merge = require('webpack-merge');
var shared = require('./webpack-shared.js');
var autoprefixer = require('autoprefixer-core');

var ROOT_PATH = path.resolve(__dirname);

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
    loaders: [{
      test: /\.css$/,
      loaders: ['style', 'css'],
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass?' + shared.sassPaths],
    }, {
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel?stage=0'],
      include: path.resolve(ROOT_PATH, 'src'),
    }, {
      test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff',
    }, {
      test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
    }, {
      test: /\.svg$/,
      loader: 'svg-inline',
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
  postcss: [autoprefixer({browsers: ['last 2 versions']})],
});
