var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);

var common = {
  entry: [path.resolve(ROOT_PATH, 'src/index')],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nelper',
    }),
  ],
};

if(TARGET === 'build') {
  module.exports = merge(common, {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css', 'sass?sourceMap=true&includePaths[]=' +
            path.resolve(__dirname, './node_modules')),
        },
        {
          test: /\.jsx?$/,
          loader: 'babel?stage=0',
          include: path.resolve(ROOT_PATH, 'src'),
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
    ],
  });
}

if(TARGET === 'dev') {
  module.exports = merge(common, {
    entry: [
      'webpack/hot/dev-server',
    ],
    module: {
      /*preLoaders: [
        {
          test: /\.css$/,
          loader: 'csslint',
        },
        {
          test: /\.jsx?$/,
          loader: 'eslint-loader',
          include: path.resolve(ROOT_PATH, 'app'),
        },
      ],*/
      loaders: [{
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass?sourceMap=true&includePaths[]=' +
            path.resolve(__dirname, './node_modules')],
        }, {
          test: /\.jsx?$/,
          loaders: ['react-hot', 'babel?stage=0'],
          include: path.resolve(ROOT_PATH, 'src'),
        },
        {test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
        {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      ],
    },
  });
}
