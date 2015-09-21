const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const shared = require('./webpack-shared.js');
const commonLoaders = require('./common-loaders');

const ROOT_PATH = path.resolve(__dirname, '..');

module.exports = [
  merge(shared.config, {
    devtool: 'source-map',
    module: {
      loaders: commonLoaders.concat([{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss!sass?' + shared.sassPaths),
      }, {
        test: /\.jsx?$/,
        loader: 'babel?plugins=./scripts/babelRelayPlugin',
        include: path.resolve(ROOT_PATH, 'src'),
      }]),
    },
    plugins: [
      new ExtractTextPlugin('styles.css', {allChunks: true}),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
        },
        '__CLIENT__': true,
        '__SERVER__': false,
        '__DEVELOPMENT__': false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          hoist_vars: true,
          screw_ie8: true,
          warnings: false,
        },
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
    ],
    postcss: [autoprefixer({browsers: ['last 2 versions']})],
  }),
  {
    name: 'server',
    debug: true,
    devtool: 'source-map',
    entry: path.resolve(ROOT_PATH, 'src/server/server.js'),
    target: 'node',
    node: {
      __filename: false,
      __dirname: false,
      console: false,
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: path.resolve(ROOT_PATH, 'src'),
    },
    output: {
      path: path.resolve(ROOT_PATH, 'build/server'),
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    },
    externals: /^[a-z\-0-9]+$/,
    plugins: [
      new webpack.BannerPlugin(
        'require("source-map-support").install();',
        { raw: true, entryOnly: false }
      ),
      new webpack.DefinePlugin({
        '__CLIENT__': false,
        '__SERVER__': true,
        '__DISABLE_SSR__': true,
        '__DEVELOPMENT__': process.env.NODE_ENV !== 'production',
      }),
    ],
    module: {
      loaders: commonLoaders.concat([{
        test: /\.css$/,
        loader: 'css/locals',
      }, {
        test: /\.scss$/,
        loader: 'css/locals?importLoaders=1!postcss!sass?' + shared.sassPaths,
      }, {
        test: /\.jsx?$/,
        loaders: ['babe'],
        include: path.resolve(ROOT_PATH, 'src'),
      }]),
    },
  },
];
