import Parse from 'parse/node';

import {NelpTask, NelpTaskApplication} from './parseTypes';
import {NELP_TASK_STATE, NELP_TASK_APPLICATION_STATE} from '../../utils/constants';
import TaskCategoryUtils from '../../utils/TaskCategoryUtils';

import {getMe} from './userData';

export async function getTask({sessionToken}, id, loadApplications = false) {
  const query = new Parse.Query(NelpTask);
  query.include('user');
  const task = await query.get(id, {sessionToken});

  if (loadApplications) {
    const applicationsQuery = new Parse.Query(NelpTaskApplication)
      .include('user')
      .equalTo('task', task)
      .notEqualTo('state', NELP_TASK_APPLICATION_STATE.CANCELED);

    const applications = await applicationsQuery.find();
    applications.forEach(a => a.set('task', task));
    task.set('applications', applications);
  }

  return task;
}

export async function getTasksForUser({sessionToken}, userId) {
  const parseUser = new Parse.User();
  parseUser.id = userId;
  const tasksQuery = new Parse.Query(NelpTask)
    .equalTo('user', parseUser)
    .containedIn('state', [NELP_TASK_STATE.PENDING, NELP_TASK_STATE.ACCEPTED])
    .descending('createdAt');
  const tasks = await tasksQuery.find({sessionToken});
  const applicationsQuery = new Parse.Query(NelpTaskApplication)
   .include('user')
   .containedIn('task', tasks)
   .notEqualTo('state', NELP_TASK_APPLICATION_STATE.CANCELED);

  const applications = await applicationsQuery.find({sessionToken});
  return tasks.map((task) => {
    const taskApplications = applications.filter((a) => {
      return a.get('task').id === task.id;
    })
    .sort((ta1, ta2) => ta1.createdAt < ta2.createdAt ? 1 : -1);
    taskApplications.forEach(a => a.set('task', task));
    task.set('applications', taskApplications);
    return task;
  });
}

export async function findTasks({userId, sessionToken}, {sort, minPrice, maxDistance, location, categories}) {
  let sortValue = sort;
  let userLoc = location;
  if (sortValue === undefined) {
    if (!userId) {
      sortValue = 2;
    } else if (!userLoc) {
      const user = await getMe({userId, sessionToken});
      userLoc = user.get('privateData').get('location');
      if (userLoc) {
        sortValue = 0;
      } else {
        sortValue = 2;
      }
    } else {
      sortValue = 0;
    }
  }

  const point = new Parse.GeoPoint(userLoc);
  const taskQuery = new Parse.Query(NelpTask);

  if (categories && categories.length !== TaskCategoryUtils.list().length) {
    taskQuery.containedIn('category', categories);
  }

  if (minPrice) {
    taskQuery.greaterThanOrEqualTo('priceOffered', minPrice);
  }

  if (maxDistance) {
    taskQuery.withinKilometers('location', point, maxDistance);
  }

  switch (sortValue) {
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

export function editTask({sessionToken}, taskId, {title, desc, pictures}) {
  const parseTask = new NelpTask();
  parseTask.id = taskId;
  if (title) {
    parseTask.set('title', title);
  }
  if (desc) {
    parseTask.set('desc', desc);
  }
  if (pictures) {
    parseTask.set('pictures', pictures.map(p => ({
      __type: 'File',
      name: p.name,
      url: p.url,
    })));
  }
  return parseTask.save(null, {sessionToken});
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
  return await parseApplication.save(null, {sessionToken});
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
  const applications = await query.find({sessionToken});
  applications.forEach(a => {
    a.set('state', NELP_TASK_APPLICATION_STATE.CANCELED);
  });
  return await Parse.Object.saveAll(applications, {sessionToken});
}

export async function deleteTask({sessionToken}, taskId) {
  const parseTask = new NelpTask();
  parseTask.id = taskId;
  parseTask.set('state', NELP_TASK_STATE.DELETED);
  return parseTask.save(null, {sessionToken});
}
