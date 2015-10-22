const babel = require('babel-core');

const babelOptions = {
  retainLines: true,
  stage: 0,
  optional: [],
};

module.exports = {
  process: (src, path) => {
    return babel.transform(src, Object.assign({filename: path}, babelOptions)).code;
  },
};
