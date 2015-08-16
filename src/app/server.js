// TODO: Use babel on this file.
/* eslint-disable */
var express = require('express'),
  path = require('path'),
  app = express(),
  port = process.env.PORT || 4000;

app.use(express.static(path.resolve(__dirname, '../../build')));

app.use(function(req, res) {
  res.sendFile('index.html', {root: path.resolve(__dirname, '../../build')});
});

app.listen(port);
/* eslint-enable */
