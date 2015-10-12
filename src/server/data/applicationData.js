import Parse from 'parse/node';

import {InvalidOperationError} from '../errors';
import {TaskApplication} from './parseTypes';
import {TASK_STATE, TASK_APPLICATION_STATE} from '../../utils/constants';

export async function getApplication({sessionToken}, id) {
  const query = new Parse.Query(TaskApplication);
  query.include('user');
  query.include('task.user');
  const application = await query.get(id, {sessionToken});
  application.get('task').set('application', application);
  return application;
}

export async function getApplicationsForUser({sessionToken}, userId) {
  const query = new Parse.Query(TaskApplication);
  const parseUser = new Parse.User();
  parseUser.id = userId;
  query.include('task.user');
  query.equalTo('user', parseUser);
  query.notEqualTo('state', TASK_APPLICATION_STATE.CANCELED);
  query.descending('createdAt');
  return await query.find({sessionToken});
}

export async function setApplicationState({sessionToken, userId}, applicationId, state) {
  const query = new Parse.Query(TaskApplication);
  query.include('task.user');
  const application = await query.get(applicationId, {sessionToken});
  const task = application.get('task');
  if (task.get('user').id !== userId) {
    throw new InvalidOperationError();
  }
  application.set('state', state);
  if (state === TASK_APPLICATION_STATE.ACCEPTED) {
    application.set('acceptedAt', new Date());
    task.set('state', TASK_STATE.ACCEPTED);
    task.set('acceptedApplication', application);
  } else {
    task.unset('acceptedApplication');
  }
  const savedObjects = await Parse.Object.saveAll([application, task], {sessionToken});
  return savedObjects[0];
}
