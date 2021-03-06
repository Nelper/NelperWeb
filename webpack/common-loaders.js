module.exports = [{
  test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: 'url-loader?limit=10000&minetype=application/font-woff',
}, {
  test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: 'file-loader',
}, {
  test: /\.svg$/,
  loader: 'svg-inline',
}, {
  test: /\.json$/,
  loader: 'json-loader',
}];
