/**
 * Wrapper around localStorage.
 */
export default class Storage {
  static getItem(key, defaultValue) {
    if (__SERVER__) {
      return defaultValue;
    }
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return defaultValue;
    }
    const item = JSON.parse(itemStr);
    return item.data;
  }

  static setItem(key, item) {
    if (__SERVER__) {
      return;
    }
    const itemStr = JSON.stringify({
      data: item,
    });
    localStorage.setItem(key, itemStr);
  }

  static removeItem(key) {
    if (__SERVER__) {
      return;
    }
    localStorage.removeItem(key);
  }

  static clear() {
    if (__SERVER__) {
      return;
    }
    localStorage.clear();
  }
}
