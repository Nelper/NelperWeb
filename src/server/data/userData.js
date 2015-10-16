import Parse from 'parse/node';

import {UserPrivateData, Feedback, TaskPrivate} from './parseTypes';
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

export async function saveGeneralSettings({userId, sessionToken}, email, phone, language) {
  const user = await getUser({sessionToken}, userId, true);
  const privateData = user.get('privateData');

  if (email) {
    privateData.set('email', email);
  }
  if (phone) {
    privateData.set('phone', phone);
  }
  if (language) {
    if (language !== 'en' && language !== 'fr') {
      throw Error('Invalid language code ' + language);
    }
    privateData.set('language', language);
  }

  await privateData.save(null, {sessionToken});

  return privateData;
}

export async function editUserLocations({userId, sessionToken}, locations) {
  const user = await getUser({sessionToken}, userId, true);
  const privateData = user.get('privateData');
  privateData.set('locations', locations);
  return await privateData.save(null, {sessionToken});
}

export async function changePassword({userId, sessionToken}, currentPassword, newPassword) {
  const user = await getUser({sessionToken}, userId);
  try {
    const loggedUser = await Parse.User.logIn(user.get('username'), currentPassword);
    if (!loggedUser) {
      throw Error('Invalid current password');
    }
  } catch (e) {
    throw Error('Invalid current password');
  }

  user.setPassword(newPassword);
  await user.save(null, {sessionToken});
  return null;
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

export async function getApplicantPrivate({userId, sessionToken}, task) {
  const application = task.get('acceptedApplication');
  // Makes sure the user is the task poster.
  if (userId !== task.get('user').id || !application) {
    return null;
  }
  const query = new Parse.Query(Parse.User)
    .include('privateData');

  // Use the master key to get the private data.
  const user = await query.get(application.get('user').id, {useMasterKey: true});
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
  const userQuery = new Parse.Query(Parse.User)
    .include('privateData');

  // Use the master key to get the private data.
  const user = await userQuery.get(task.get('user').id, {useMasterKey: true});
  const privateData = user.get('privateData');

  const taskPrivateQuery = new Parse.Query(TaskPrivate);
  const taskPrivate = await taskPrivateQuery.get(task.get('privateData').id, {useMasterKey: true});
  return {
    email: privateData.get('email'),
    phone: privateData.get('phone'),
    exactLocation: taskPrivate.get('location'),
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

  return await query.find({sessionToken});
}

export async function editUserProfile({sessionToken, userId}, picture, about, skills, education, experience) {
  const parseUser = new Parse.User();
  parseUser.id = userId;
  if (picture) {
    parseUser.set('customPicture', {
      __type: 'File',
      ...picture,
    });
  }
  if (typeof about !== 'undefined') {
    parseUser.set('about', about);
  }
  if (skills) {
    parseUser.set('skills', skills);
  }
  if (education) {
    parseUser.set('education', education);
  }
  if (experience) {
    parseUser.set('experience', experience);
  }

  return await parseUser.save(null, {sessionToken});
}
