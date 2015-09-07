const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer-core');

const shared = require('./webpack-shared.js');
const commonLoaders = require('./common-loaders');

const ROOT_PATH = path.resolve(__dirname, '..');

module.exports = [
  merge(shared.config, {
    module: {
      loaders: commonLoaders.concat([{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass?' + shared.sassPaths),
      }, {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.resolve(ROOT_PATH, 'src'),
      }]),
    },
    plugins: [
      new ExtractTextPlugin('styles.css'),
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production'),
        },
        '__CLIENT__': true,
        '__SERVER__': false,
        '__DEVELOPMENT__': false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.DedupePlugin(),
    ],
    postcss: [autoprefixer({browsers: ['last 2 versions']})],
  }),
  {
    name: 'server',
    debug: true,
    devtool: 'source-map',
    cache: true,
    entry: path.resolve(ROOT_PATH, 'src/server/server.js'),
    target: 'node',
    node: {
      __dirname: true,
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
        '__DEVELOPMENT__': process.env.NODE_ENV !== 'production',
      }),
    ],
    module: {
      loaders: commonLoaders.concat([{
        test: /\.css$/,
        loader: 'null-loader',
      }, {
        test: /\.scss$/,
        loader: 'null-loader',
      }, {
        test: /\.jsx?$/,
        loaders: ['babel?stage=0&optional=runtime'],
        include: path.resolve(ROOT_PATH, 'src'),
      }]),
    },
  },
];
