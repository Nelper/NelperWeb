/* eslint no-console:0 */

import {Parse} from 'parse';

export default class LogUtils {
  static init() {
    if (__CLIENT__) {
      window.onerror = (err) => {
        if (__DEVELOPMENT__) {
          return;
        }
        LogUtils.error('WEB_GENERIC', err);
      };
    }
  }

  static error(code, err) {
    if (__DEVELOPMENT__) {
      console.error(err);
    } else {
      const errMessage = err.stack || err.message || err.toString();
      Parse.Analytics.track('error', { code: code, message: errMessage });
    }
  }

  static log(message) {
    if (__SERVER__ || __DEVELOPMENT__) {
      console.log(message);
    }
  }

  static warn(message) {
    if (__SERVER__ || __DEVELOPMENT__) {
      console.warn(message);
    }
  }
}
