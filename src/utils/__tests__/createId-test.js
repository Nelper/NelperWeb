jest.dontMock('../createId');

const createId = require('../createId').default;

describe('createId', () => {
  it('returns a unique id', () => {
    expect(createId()).not.toBe(createId());
  });
});
