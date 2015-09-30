import Parse from 'parse/node';

import {InvalidOperationError} from '../errors';
import {NelpTaskApplication} from './parseTypes';
import {TASK_APPLICATION_STATE} from '../../utils/constants';

export async function getApplication({sessionToken}, id) {
  const query = new Parse.Query(NelpTaskApplication);
  query.include('user');
  query.include('task.user');
  const application = await query.get(id, {sessionToken});
  application.get('task').set('application', application);
  return application;
}

export async function getApplicationsForUser({sessionToken}, userId) {
  const query = new Parse.Query(NelpTaskApplication);
  const parseUser = new Parse.User();
  parseUser.id = userId;
  query.include('task.user');
  query.equalTo('user', parseUser);
  query.notEqualTo('state', TASK_APPLICATION_STATE.CANCELED);
  query.descending('createdAt');
  return await query.find({sessionToken});
}

export async function setApplicationState({sessionToken, userId}, applicationId, state) {
  const query = new Parse.Query(NelpTaskApplication);
  query.include('task.user');
  const application = await query.get(applicationId, {sessionToken});
  if (application.get('task').get('user').id !== userId) {
    throw new InvalidOperationError();
  }
  application.set('state', state);
  if (state === TASK_APPLICATION_STATE.ACCEPTED) {
    application.set('acceptedAt', new Date());
  }
  return await application.save(null, {sessionToken});
}
