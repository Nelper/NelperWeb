import Parse from 'parse/node';

import {Task, TaskPrivate, TaskApplication, Feedback} from './parseTypes';
import {TASK_STATE, TASK_APPLICATION_STATE, TASK_COMPLETION_STATE} from '../../utils/constants';
import TaskCategoryUtils from '../../utils/TaskCategoryUtils';
import {InvalidOperationError} from '../errors';

import {getMe} from './userData';

export async function getTask({sessionToken}, id, loadApplications = false) {
  const query = new Parse.Query(Task)
    .include('user')
    .include('privateData')
    .include('acceptedApplication.user');
  const task = await query.get(id, {sessionToken});

  if (loadApplications) {
    const applicationsQuery = new Parse.Query(TaskApplication)
      .include('user')
      .equalTo('task', task)
      .notEqualTo('state', TASK_APPLICATION_STATE.CANCELED);

    const applications = await applicationsQuery.find();
    applications.forEach(a => a.set('task', task));
    task.set('applications', applications);
  }

  return task;
}

export async function getTasksForUser({sessionToken}, userId) {
  const parseUser = new Parse.User();
  parseUser.id = userId;
  const tasksQuery = new Parse.Query(Task)
    .include('privateData')
    .include('acceptedApplication.user')
    .equalTo('user', parseUser)
    .containedIn('state', [TASK_STATE.PENDING, TASK_STATE.ACCEPTED])
    .descending('createdAt');
  const tasks = await tasksQuery.find({sessionToken});
  const applicationsQuery = new Parse.Query(TaskApplication)
   .include('user')
   .containedIn('task', tasks)
   .notEqualTo('state', TASK_APPLICATION_STATE.CANCELED);

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
  const taskQuery = new Parse.Query(Task);

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
  taskQuery.equalTo('state', TASK_STATE.PENDING);
  const tasks = await taskQuery.find({sessionToken});

  if (userId) {
    const parseUser = new Parse.User();
    parseUser.id = userId;
    const applicationQuery = new Parse.Query(TaskApplication);
    applicationQuery.equalTo('user', parseUser);
    applicationQuery.equalTo('state', TASK_APPLICATION_STATE.PENDING);
    applicationQuery.containedIn('task', tasks);
    const applications = await applicationQuery.find({sessionToken});

    tasks.forEach(task => {
      const application = applications.find(a => a.get('task').id === task.id);
      task.set('application', application);
    });
  }

  return tasks;
}

/**
 * Add random noise to a location.
 * @param  {GeoPoint} coords The geopoint to round
 * @return {GeoPoint}        The rounded geopoint
 */
function roundCoords(coords) {
  return {
    latitude: coords.latitude + (Math.random() - 0.5) / 143,
    longitude: coords.longitude + (Math.random() - 0.5) / 143,
  };
}

export async function postTask({sessionToken, userId}, title, category, desc, priceOffered, location, pictures) {
  const parseUser = new Parse.User();
  parseUser.id = userId;
  const parseTask = new Task();
  parseTask.set('title', title);
  parseTask.set('category', category);
  parseTask.set('desc', desc);
  parseTask.set('priceOffered', priceOffered);
  parseTask.set('state', TASK_STATE.PENDING);
  parseTask.set('completionState', 0);
  parseTask.set('location', new Parse.GeoPoint(roundCoords(location.coords)));
  parseTask.set('city', location.city);
  parseTask.set('user', parseUser);
  parseTask.set('pictures', pictures.map(p => {
    return {
      __type: 'File',
      name: p.name,
      url: p.url,
    };
  }));

  const acl = new Parse.ACL(parseUser);
  acl.setPublicReadAccess(true);
  parseTask.setACL(acl);

  const taskPrivate = new TaskPrivate();
  taskPrivate.set('location', location);
  const privateACL = new Parse.ACL(parseUser);
  taskPrivate.setACL(privateACL);
  await taskPrivate.save();

  parseTask.set('privateData', taskPrivate);

  return await parseTask.save();
}

export async function editTask({sessionToken}, taskId, {title, desc, pictures}) {
  const parseTask = new Task();
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
  return await parseTask.save(null, {sessionToken});
}

export async function applyForTask({userId, sessionToken}, taskId, price) {
  const parseTask = new Task();
  parseTask.id = taskId;
  const parseUser = new Parse.User();
  parseUser.id = userId;
  const parseApplication = new TaskApplication();
  parseApplication.set('state', TASK_APPLICATION_STATE.PENDING);
  parseApplication.set('user', parseUser);
  parseApplication.set('task', parseTask);
  parseApplication.set('isNew', true);
  parseApplication.set('price', price);
  return await parseApplication.save(null, {sessionToken});
}

export async function cancelApplyForTask({userId, sessionToken}, taskId) {
  const parseTask = new Task();
  parseTask.id = taskId;
  const parseUser = new Parse.User();
  parseUser.id = userId;
  const query = new Parse.Query(TaskApplication);
  query.equalTo('user', parseUser);
  query.equalTo('task', parseTask);
  query.notEqualTo('state', TASK_APPLICATION_STATE.CANCELED);
  const applications = await query.find({sessionToken});
  applications.forEach(a => {
    a.set('state', TASK_APPLICATION_STATE.CANCELED);
  });
  return await Parse.Object.saveAll(applications, {sessionToken});
}

export async function deleteTask({sessionToken}, taskId) {
  const parseTask = new Task();
  parseTask.id = taskId;
  parseTask.set('state', TASK_STATE.DELETED);
  return parseTask.save(null, {sessionToken});
}

export async function completeTask({sessionToken, userId}, taskId) {
  const task = await getTask({sessionToken, userId}, taskId);
  if (userId !== task.get('user').id || task.get('completionState') !== TASK_COMPLETION_STATE.PAYMENT_SENT) {
    throw new InvalidOperationError();
  }

  task.set('completionState', TASK_COMPLETION_STATE.COMPLETED);
  task.get('user').increment('tasksCompleted');
  await task.save(null, {sessionToken});

  return task;
}

export async function addApplicantFeedback({sessionToken, userId}, taskId, rating, content) {
  const task = await getTask({sessionToken, userId}, taskId);
  if (userId !== task.get('user').id || task.get('completionState') !== TASK_COMPLETION_STATE.COMPLETED) {
    throw new InvalidOperationError();
  }
  const application = task.get('acceptedApplication');

  task.set('completionState', TASK_COMPLETION_STATE.RATED);
  task.set('state', TASK_STATE.COMPLETED);

  if (rating) {
    const feedback = new Feedback();
    feedback.set('rating', rating);
    feedback.set('content', content);
    feedback.set('user', application.get('user'));
    feedback.set('poster', task.get('user'));
    feedback.set('task', task);
    await Parse.Object.saveAll([task, feedback], {sessionToken});
  } else {
    await task.save(null, {sessionToken});
  }

  return task;
}
