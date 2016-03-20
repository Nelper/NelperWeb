jest.dontMock('../Storage');

const Storage = require('../Storage').default;

class FakeLocalStorage {
  _data = {}

  getItem(key) {
    return this._data[key];
  }

  setItem(key, value) {
    this._data[key] = value;
  }

  removeItem(key) {
    delete this._data[key];
  }

  clear() {
    this._data = {};
  }
}

describe('Storage', () => {
  beforeEach(() => {
    global.localStorage = new FakeLocalStorage();
  });

  it('returns the default value for an unset key', () => {
    expect(Storage.getItem('key', 'hello')).toBe('hello');
  });

  it('can set and get a value', () => {
    Storage.setItem('key', 'bye');
    expect(Storage.getItem('key', 'hello')).toBe('bye');
  });

  it('can delete a key', () => {
    Storage.setItem('key', 'bye');
    Storage.removeItem('key');
    expect(Storage.getItem('key', 'hello')).toBe('hello');
  });

  it('can clear all keys', () => {
    Storage.setItem('key', 'bye');
    Storage.clear();
    expect(Storage.getItem('key', 'hello')).toBe('hello');
  });

  afterEach(() => {
    global.localStorage = undefined;
  });
});
