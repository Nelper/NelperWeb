jest.dontMock('../userData');

import Parse from '../parse';
import {UserPrivateData} from '../parseTypes';

const {
  getMe,
  saveGeneralSettings,
} = require('../userData');

const USER_ID = '2';
const SESSION_TOKEN = '1234';
const ROOT_VALUE = {sessionToken: SESSION_TOKEN, userId: USER_ID};

function getMockData() {
  const users = [];
  let user;
  user = new Parse.User();
  user.id = '1';
  user.set('name', 'Lud');
  users.push(user);
  user = new Parse.User();
  user.id = USER_ID;
  user.set('name', 'Jane Mills');
  const privateData = new UserPrivateData();
  privateData.set('email', 'jane@nelper.ca');
  privateData.set('phone', '1234567890');
  privateData.set('language', 'fr');
  user.set('privateData', privateData);
  users.push(user);
  user = new Parse.User();
  user.id = '3';
  user.set('name', 'Dèèèève');
  users.push(user);
  user = new Parse.User();
  user.id = '4';
  user.set('name', 'Chat');
  users.push(user);
  return users;
}

describe('userData', () => {
  describe('getMe', () => {
    pit('gets the user if it can access privateData', async () => {
      Parse.__setMockData(Parse.User, getMockData());
      const me = await getMe(ROOT_VALUE);
      expect(me.get('name')).toBe('Jane Mills');
      expect(me.me).toBe(true);
    });

    pit('returns null if it cannot access privateData', async () => {
      Parse.__setMockData(Parse.User, getMockData());
      const me = await getMe({sessionToken: SESSION_TOKEN, userId: '3'});
      expect(me).toBeNull();
    });

    pit('returns null if the session token or id is not provided', async () => {
      Parse.__setMockData(Parse.User, getMockData());
      let me = await getMe({userId: USER_ID});
      expect(me).toBeNull();
      me = await getMe({sessionToken: SESSION_TOKEN});
      expect(me).toBeNull();
      me = await getMe({});
      expect(me).toBeNull();
    });
  });

  describe('saveGeneralSettings', () => {
    pit('updates the email only', async () => {
      const data = getMockData();
      const userPrivate = data.find(u => u.id === USER_ID).get('privateData');
      const newEmail = 'mills@nelper.ca';
      const expected = userPrivate.clone();
      expected.set('email', newEmail);
      Parse.__setMockData(Parse.User, data);

      await saveGeneralSettings(ROOT_VALUE, newEmail);

      expect(userPrivate.get('email')).toBe(expected.get('email'));
      expect(userPrivate.get('phone')).toBe(expected.get('phone'));
      expect(userPrivate.get('language')).toBe(expected.get('language'));
    });

    pit('updates the phone only', async () => {
      const data = getMockData();
      const userPrivate = data.find(u => u.id === USER_ID).get('privateData');
      const newPhone = '0987654321';
      const expected = userPrivate.clone();
      expected.set('phone', newPhone);
      Parse.__setMockData(Parse.User, data);

      await saveGeneralSettings(ROOT_VALUE, undefined, newPhone);

      expect(userPrivate.get('email')).toBe(expected.get('email'));
      expect(userPrivate.get('phone')).toBe(expected.get('phone'));
      expect(userPrivate.get('language')).toBe(expected.get('language'));
    });

    pit('updates the language only', async () => {
      const data = getMockData();
      const userPrivate = data.find(u => u.id === USER_ID).get('privateData');
      const newLang = 'en';
      const expected = userPrivate.clone();
      expected.set('language', newLang);
      Parse.__setMockData(Parse.User, data);

      await saveGeneralSettings(ROOT_VALUE, undefined, undefined, newLang);

      expect(userPrivate.get('email')).toBe(expected.get('email'));
      expect(userPrivate.get('phone')).toBe(expected.get('phone'));
      expect(userPrivate.get('language')).toBe(expected.get('language'));
    });

    pit('updates all settings', async () => {
      const data = getMockData();
      const userPrivate = data.find(u => u.id === USER_ID).get('privateData');
      const newEmail = 'mills@nelper.ca';
      const newPhone = '0987654321';
      const newLang = 'en';
      const expected = userPrivate.clone();
      expected.set('email', newEmail);
      expected.set('phone', newPhone);
      expected.set('language', newLang);
      Parse.__setMockData(Parse.User, data);

      await saveGeneralSettings(ROOT_VALUE, newEmail, newPhone, newLang);

      expect(userPrivate.get('email')).toBe(expected.get('email'));
      expect(userPrivate.get('phone')).toBe(expected.get('phone'));
      expect(userPrivate.get('language')).toBe(expected.get('language'));
    });

    pit('throws if invalid language code', async () => {
      const data = getMockData();
      const userPrivate = data.find(u => u.id === USER_ID).get('privateData');
      const expected = userPrivate.clone();
      Parse.__setMockData(Parse.User, data);

      try {
        await saveGeneralSettings(ROOT_VALUE, undefined, undefined, 'es');
        expect(false).toBe(true);
      } catch (err) {
        expect(true).toBe(true);
      }

      expect(userPrivate.get('language')).toBe(expected.get('language'));
    });
  });

  afterEach(() => {
    Parse.__clearMockData();
  });
});
