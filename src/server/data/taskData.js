import Parse from 'parse/node';

import {NelpTask, NelpTaskApplication} from '../../utils/ParseModels';
import {NELP_TASK_STATE, NELP_TASK_APPLICATION_STATE} from '../../utils/constants';
import TaskCategoryUtils from '../../utils/TaskCategoryUtils';

export async function getTask({sessionToken}, id) {
  const query = new Parse.Query(NelpTask);

  return await query.get(id, {sessionToken});
}

export async function getTasksForUser({sessionToken}, userId) {
  const query = new Parse.Query(NelpTask);
  const parseUser = new Parse.User();
  parseUser.id = userId;
  query.equalTo('user', parseUser);
  query.containedIn('state', [NELP_TASK_STATE.PENDING, NELP_TASK_STATE.ACCEPTED]);
  query.descending('createdAt');
  return await query.find({sessionToken});
}

export async function findTasks({userId, sessionToken}, {sort, minPrice, maxDistance, location, categories}) {
  const taskQuery = new Parse.Query(NelpTask);
  const point = new Parse.GeoPoint(location);

  if (categories && categories.length !== TaskCategoryUtils.list().length) {
    taskQuery.containedIn('category', categories);
  }

  if (minPrice) {
    taskQuery.greaterThanOrEqualTo('priceOffered', minPrice);
  }

  if (maxDistance) {
    taskQuery.withinKilometers('location', point, maxDistance);
  }

  switch (sort) {
  case 0:
    taskQuery.near('location', point);
    break;
  case 1:
    taskQuery.descending('priceOffered');
    break;
  case 2:
  default:
    taskQuery.descending('createdAt');
    break;
  }

  taskQuery.include('user');
  taskQuery.equalTo('state', NELP_TASK_STATE.PENDING);
  const tasks = await taskQuery.find({sessionToken});

  if (userId) {
    const parseUser = new Parse.User();
    parseUser.id = userId;
    const applicationQuery = new Parse.Query(NelpTaskApplication);
    applicationQuery.equalTo('user', parseUser);
    applicationQuery.equalTo('state', NELP_TASK_APPLICATION_STATE.PENDING);
    applicationQuery.containedIn('task', tasks);
    const applications = await applicationQuery.find({sessionToken});

    tasks.forEach(task => {
      const application = applications.find(a => a.get('task').id === task.id);
      task.set('application', application);
    });
  }

  return tasks;
}
