const babel = require('babel-core');

const babelOptions = {
  retainLines: true,
  stage: 0,
  auxiliaryCommentBefore: 'istanbul ignore next',
  plugins: [],
};

module.exports = {
  process: (src, filename) => {
    if (!babel.canCompile(filename)) {
      return '';
    }
    return babel.transform(src, Object.assign({filename: filename}, babelOptions)).code;
  },
};
