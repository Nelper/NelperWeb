import Parse from 'parse/node';

import {UserPrivateData} from './parseTypes';
import {fixParseFileURL} from '../../utils/ParseUtils';

export async function getMe({userId, sessionToken}) {
  const query = new Parse.Query(Parse.User)
    .include('privateData');

  const user = await query.get(userId, {sessionToken});
  // Makes sure that the provided userId matches the session token by
  // trying to get a private field.
  if (!user.get('privateData')) {
    throw Error('Unauthorized');
  }
  user.me = true;
  return user;
}

export async function getUser({sessionToken}, userId) {
  const query = new Parse.Query(Parse.User);

  return await query.get(userId, {sessionToken});
}

export async function getUserPrivate({sessionToken}, id) {
  const query = new Parse.Query(UserPrivateData);

  return await query.get(id, {sessionToken});
}

export function getUserPicture(user) {
  const customPicture = user.get('customPicture');
  if (customPicture) {
    return fixParseFileURL(customPicture.url());
  }

  return fixParseFileURL(user.get('pictureURL'));
}
