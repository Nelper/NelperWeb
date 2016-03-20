const babelJest = require('babel-jest');

require('babel-polyfill');

module.exports = {
  process: (src, filename) => {
    if (filename.match(/\.jsx?$/)) {
      return babelJest.process(src, filename);
    }
    return '';
  },
};
