const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const shared = require('./webpack-shared.js');
const commonLoaders = require('./common-loaders');

const ROOT_PATH = path.resolve(__dirname, '..');

module.exports = merge(shared.config, {
  debug: true,
  devtool: 'eval',
  entry: {
    main: [
      'event-source-polyfill', // Required for webpack-hot-middleware to work in safari and ie...
      'webpack-hot-middleware/client',
      path.resolve(ROOT_PATH, 'src/app/main'),
    ],
    dev: [
      'webpack-hot-middleware/client',
      path.resolve(ROOT_PATH, 'src/app/dev'),
    ],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/',
  },
  module: {
    /* preLoaders: [{
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      include: path.resolve(ROOT_PATH, 'src'),
      exclude: path.resolve(ROOT_PATH, 'node_modules'),
    }],*/
    loaders: commonLoaders.concat([{
      test: /\.css$/,
      loaders: ['style', 'css'],
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css?importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss', 'sass?' + shared.sassPaths],
    }, {
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel?plugins=./scripts/babelRelayPlugin'],
      include: path.resolve(ROOT_PATH, 'src'),
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=4098&name=[path][name].[ext]',
    }]),
  },
  postcss: [autoprefixer({browsers: ['last 1 Chrome versions']})],
  plugins: [
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__SERVER__': false,
      '__DEVELOPMENT__': true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
});
