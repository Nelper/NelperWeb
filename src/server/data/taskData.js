import Parse from 'parse/node';

import {NelpTask, NelpTaskApplication} from './parseTypes';
import {NELP_TASK_STATE, NELP_TASK_APPLICATION_STATE} from '../../utils/constants';
import TaskCategoryUtils from '../../utils/TaskCategoryUtils';

export async function getTask({sessionToken}, id) {
  const query = new Parse.Query(NelpTask);
  query.include('user');
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

export async function applyForTask({userId, sessionToken}, taskId, price) {
  const parseTask = new NelpTask();
  parseTask.id = taskId;
  const parseUser = new Parse.User();
  parseUser.id = userId;
  const parseApplication = new NelpTaskApplication();
  parseApplication.set('state', NELP_TASK_APPLICATION_STATE.PENDING);
  parseApplication.set('user', parseUser);
  parseApplication.set('task', parseTask);
  parseApplication.set('isNew', true);
  parseApplication.set('price', price);
  return await parseApplication.save();
}

export async function cancelApplyForTask({userId, sessionToken}, taskId) {
  const parseTask = new NelpTask();
  parseTask.id = taskId;
  const parseUser = new Parse.User();
  parseUser.id = userId;
  const query = new Parse.Query(NelpTaskApplication);
  query.equalTo('user', parseUser);
  query.equalTo('task', parseTask);
  query.notEqualTo('state', NELP_TASK_APPLICATION_STATE.CANCELED);
  const applications = await query.find();
  applications.forEach(a => {
    a.set('state', NELP_TASK_APPLICATION_STATE.CANCELED);
  });
  return await Parse.Object.saveAll(applications);
}
