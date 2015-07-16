var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var neat = require('node-neat');

var ROOT_PATH = path.resolve(__dirname);

var common = {
  entry: [path.resolve(ROOT_PATH, 'src/app')],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: false,
    }),
  ],
};

var sassNeatPaths = neat.with([
  path.resolve(ROOT_PATH, './src/styles'),
  path.resolve(ROOT_PATH, './node_modules'),
]).map(function(neatPath) {
    return 'includePaths[]=' + neatPath;
}).join('&');

module.exports.config = common;
module.exports.sassPaths = sassNeatPaths;
