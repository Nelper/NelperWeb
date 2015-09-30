import Parse from 'parse/node';

import {UserPrivateData, Feedback} from './parseTypes';
import {fixParseFileURL} from '../../utils/ParseUtils';
import {TASK_APPLICATION_STATE} from '../../utils/constants';

export async function getMe({userId, sessionToken}) {
  if (!userId || !sessionToken) {
    return null;
  }

  const query = new Parse.Query(Parse.User)
    .include('privateData');

  const user = await query.get(userId, {sessionToken});
  // Makes sure that the provided userId matches the session token by
  // trying to get a private field.
  if (!user.get('privateData')) {
    return null;
  }
  user.me = true;
  return user;
}

export async function getUser({sessionToken}, userId, includePrivate = false) {
  const query = new Parse.Query(Parse.User);
  if (includePrivate) {
    query.include('privateData');
  }
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

export async function changeUserLanguage({userId, sessionToken}, language) {
  if (language !== 'en' && language !== 'fr') {
    throw Error('Invalid language code ' + language);
  }

  const user = await getUser({sessionToken}, userId, true);
  const privateData = user.get('privateData');
  privateData.set('language', language);
  await privateData.save(null, {sessionToken});

  return privateData;
}

export async function updateNotificationSettings({userId, sessionToken}, settingId, settingValue) {
  const user = await getUser({sessionToken}, userId, true);
  const privateData = user.get('privateData');
  const notifications = privateData.get('notifications');
  if (!notifications[settingId]) {
    throw Error('Invalid setting type ' + settingId);
  }
  notifications[settingId] = settingValue;
  privateData.set('notifications', notifications);
  return privateData.save(null, {sessionToken});
}

export async function getApplicantPrivate({userId, sessionToken}, application) {
  // Makes sure the user is the task poster.
  if (userId !== application.get('task').get('user').id ||
      application.get('state') !== TASK_APPLICATION_STATE.ACCEPTED) {
    return null;
  }
  const query = new Parse.Query(Parse.User)
    .include('privateData');

  // Use the master key to get the private data.
  const user = await query.get(userId, {useMasterKey: true});
  const privateData = user.get('privateData');
  return {
    email: privateData.get('email'),
    phone: privateData.get('phone'),
  };
}

/**
 * Returns a user private data using the master. Make sure the User
 * has the right to access it because it will bypass ACL.
 * @param  {string} userId The user id to get its private data
 * @return {UserPrivateData} The user private data
 */
export async function getUserPrivateWithMasterKey(userId) {
  const query = new Parse.Query(Parse.User)
    .include('privateData');

  // Use the master key to get the private data.
  const user = await query.get(userId, {useMasterKey: true});
  return user.get('privateData');
}

export async function getTaskPosterPrivate({userId, sessionToken}, task) {
  // Makes sure the user is the task poster.
  const acceptedApplication = task.get('application');
  if (acceptedApplication.get('user').id !== userId ||
      acceptedApplication.get('state') !== TASK_APPLICATION_STATE.ACCEPTED) {
    return null;
  }
  const query = new Parse.Query(Parse.User)
    .include('privateData');

  // Use the master key to get the private data.
  const user = await query.get(userId, {useMasterKey: true});
  const privateData = user.get('privateData');
  const taskLocation = privateData.get('locations')[0];
  return {
    email: privateData.get('email'),
    phone: privateData.get('phone'),
    exactLocation: {
      streetNumber: taskLocation.streetNumber,
      route: taskLocation.route,
      city: taskLocation.city,
      province: taskLocation.province,
      country: taskLocation.country,
      postalCode: taskLocation.postalCode,
      coords: taskLocation.coords,
    },
  };
}

export async function getUserFeedback({sessionToken}, userId) {
  const parseUser = new Parse.User();
  parseUser.id = userId;
  const query = new Parse.Query(Feedback)
    .include('poster')
    .include('task')
    .equalTo('user', parseUser)
    .descending('createdAt');

  return await query.find();
}
