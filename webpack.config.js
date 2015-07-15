var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var neat = require('node-neat');

var TARGET = process.env.TARGET;
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
  path.resolve(__dirname, './src/styles'),
  path.resolve(__dirname, './node_modules'),
]).map(function(neatPath) {
    return 'includePaths[]=' + neatPath;
}).join('&');

if(TARGET === 'build') {
  module.exports = merge(common, {
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: ['style', 'css'],
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap&' + sassNeatPaths),
      }, {
        test: /\.jsx?$/,
        loader: 'babel?stage=0',
        include: path.resolve(ROOT_PATH, 'src'),
      }, {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader',
      }, {
        test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192',
      },
    ],
  },
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
}

if(TARGET === 'dev') {
  module.exports = merge(common, {
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
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap&' + sassNeatPaths],
      }, {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel?stage=0'],
        include: path.resolve(ROOT_PATH, 'src'),
      }, {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
      },
    ],
  },
});
}
