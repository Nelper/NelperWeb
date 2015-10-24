jest.dontMock('../userData');

import Parse from '../parse';

const {getMe} = require('../userData');

describe.only('userData', () => {
  pit('getMe', async () => {
    const user = new Parse.User();
    user.id = '1';
    user.set('name', 'Jane Mills');
    Parse.__setMockData(Parse.User, [
      user,
    ]);
    const me = await getMe({sessionToken: '1234', userId: '1'});
    expect(me).toBeDefined();
  });

  afterEach(() => {
    Parse.__clearMockData();
  });
});
