var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var shared = require('./webpack-shared.js');

var ROOT_PATH = path.resolve(__dirname);

module.exports = merge(shared.config, {
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: ['style', 'css'],
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap&' + shared.sassPaths),
    }, {
      test: /\.jsx?$/,
      loader: 'babel?stage=0',
      include: path.resolve(ROOT_PATH, 'src'),
    }, {
      test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff',
    }, {
      test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader',
    }, {
      test: /\.svg$/,
      loader: 'svg-inline',
    }, {
      test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192',
    },
  ]},
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.DedupePlugin(),
  ],
});
