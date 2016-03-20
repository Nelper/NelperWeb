const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: 'airbnb',
  env: {
    jest: true,
    jasmine: true,
  },
  globals: {
    __CLIENT__: true,
    __SERVER__: true,
    __DEVELOPMENT__: true,
    __DISABLE_SSR__: true,
    FB: true,
  },
  rules: {
    'id-length': OFF,
    'indent': [WARN, 2, {SwitchCase: 0}],
    'object-curly-spacing': [WARN, 'never'],
    'max-len': [WARN, 120],
    'react/jsx-no-bind': [WARN, {allowArrowFunctions: true}],
    'react/prefer-stateless-function': [OFF],
  },
  parser: 'babel-eslint',
};
