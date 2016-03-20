jest.dontMock('../IntlUtils');

const IntlUtils = require('../IntlUtils').default;

describe('IntlUtils', () => {
  it('returns the phone number with only numbers', () => {
    expect(IntlUtils.cleanPhoneNumber('(123) 456-7890')).toBe('1234567890');
  });

  it('returns the phone number formatted', () => {
    expect(IntlUtils.formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });
});
