jest.dontMock('../TaskCategoryUtils');

const TaskCategoryUtils = require('../TaskCategoryUtils').default;

describe('TaskCategoryUtils', () => {
  it('returns the list of categories', () => {
    const expected = ['technology', 'business', 'multimedia',
      'gardening', 'handywork', 'housecleaning', 'other'];
    TaskCategoryUtils.list().forEach((c, i) => {
      expect(c === expected[i]);
    });
  });

  it('returns a category image', () => {
    // TODO: Make jest work with webpack.
    // expect(TaskCategoryUtils.getImage('technology')).not.toBe(null);
  });

  it('returns null for invalid category image', () => {
    expect(TaskCategoryUtils.getImage('idk')).toBe(null);
  });
});
