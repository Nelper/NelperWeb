import Parse from 'parse/node';

import {NelpTaskApplication} from './parseTypes';
import {NELP_TASK_APPLICATION_STATE} from '../../utils/constants';

export async function getApplication({sessionToken}, id) {
  const query = new Parse.Query(NelpTaskApplication);
  query.include('user');
  query.include('task.user');
  return await query.get(id, {sessionToken});
}

export async function getApplicationsForUser({sessionToken}, userId) {
  const query = new Parse.Query(NelpTaskApplication);
  const parseUser = new Parse.User();
  parseUser.id = userId;
  query.include('task.user');
  query.equalTo('user', parseUser);
  query.notEqualTo('state', NELP_TASK_APPLICATION_STATE.CANCELED);
  query.descending('createdAt');
  return await query.find({sessionToken});
}
