import {Parse} from 'parse';

import {NELP_TASK_STATE, NELP_TASK_APPLICATION_STATE} from 'utils/constants';

const NelpTask = new Parse.Object.extend({className: 'NelpTask'});

const NelpTaskApplication = new Parse.Object.extend({className: 'NelpTaskApplication'});

class ApiUtils {

  login(email, password) {
    return Parse.User.logIn(email, password)
      .then(u => u.toJSON());
  }

  register(email, password, name) {
    let user = new Parse.User();
    user.set('username', email);
    user.set('email', email);
    user.set('password', password);
    user.set('name', name);
    return user.signUp()
      .then(u => u.toJSON());
  }

  loginWithFacebook() {
    return new Promise((resolve, reject) => {
      Parse.FacebookUtils.logIn(null, {
        success: (user) => {
          resolve(user);
        },
        error: (error) => {
          reject(error);
        },
      });
    }).then((user) => {
      return this.getUserInfoFromFacebook()
        .then((fbUser) => {
          user.set('name', fbUser.name);
          user.set('pictureURL', fbUser.picture.data.url);
          user.save();
          return user.toJSON();
        });
    });
  }

  getUserInfoFromFacebook() {
    return new Promise((resolve, reject) => {
      FB.api('me?fields=name,picture.type(large)', (response) => {
        if(response.error) {
          reject(response.error);
          return;
        }
        resolve(response);
      });
    });
  }

  updateUser() {
    return Parse.User.current().fetch()
      .then((user) => user.toJSON());
  }

  setUserLocation(loc) {
    let pt = new Parse.GeoPoint(loc.latitude, loc.longitude);
    let user = Parse.User.current();
    user.set('location', pt);
    user.save();
  }

  logout() {
    Parse.User.logOut();
  }

  listNelpTasks() {
    return new Parse.Query(NelpTask)
      //.notEqualTo('user', Parse.User.current())
      //.equalTo('state', NELP_TASK_STATE.PENDING)
      .descending('createdAt')
      .limit(20)
      .find()
      .then((tasks) => {
        return new Parse.Query(NelpTaskApplication)
          .equalTo('user', Parse.User.current())
          .equalTo('state', NELP_TASK_APPLICATION_STATE.PENDING)
          .containedIn('task', tasks)
          .find()
          .then((applications) => {
            return tasks.map((t) => {
              let application = applications.find((a) => a.get('task').id === t.id);
              return {
                objectId: t.id,
                createdAt: t.createdAt,
                title: t.get('title'),
                desc: t.get('desc'),
                priceOffered: t.get('priceOffered'),
                state: t.get('state'),
                location: t.get('location'),
                application: application && application.toJSON(),
              };
            });
          });
      });
  }

  listMyNelpTasks() {
    return new Parse.Query(NelpTask)
      .equalTo('user', Parse.User.current())
      .containedIn('state', [NELP_TASK_STATE.PENDING, NELP_TASK_STATE.ACCEPTED])
      .descending('createdAt')
      .limit(20)
      .find()
      .then((tasks) => {
        return new Parse.Query(NelpTaskApplication)
          .include('user')
          .containedIn('task', tasks)
          .notEqualTo('state', NELP_TASK_APPLICATION_STATE.CANCELED)
          .find()
          .then((applications) => {
            return tasks.map((t) => {
              let taskApplications = applications.filter((a) => {
                return a.get('task').id === t.id;
              })
              .sort((ta1, ta2) => ta1.createdAt < ta2.createdAt ? 1 : -1);
              let task = {
                objectId: t.id,
                title: t.get('title'),
                desc: t.get('desc'),
                priceOffered: t.get('priceOffered'),
                location: t.get('location'),
                state: t.get('state'),
              };
              task.applications = taskApplications.map(a => {
                return {
                  objectId: a.id,
                  createdAt: a.createdAt,
                  isNew: a.get('isNew'),
                  state: a.get('state'),
                  user: a.get('user').toJSON(),
                  task: task,
                };
              });
              return task;
            });
          });
      });
  }

  addTask(task) {
    let parseTask = new NelpTask();
    parseTask.set('title', task.title);
    parseTask.set('desc', task.desc);
    parseTask.set('priceOffered', task.priceOffered);
    parseTask.set('state', task.state);
    parseTask.set('location', new Parse.GeoPoint(task.location));
    parseTask.set('user', Parse.User.current());
    parseTask.save();
  }

  deleteTask(task) {
    let parseTask = new NelpTask();
    parseTask.id = task.objectId;
    parseTask.set('state', NELP_TASK_STATE.DELETED);
    parseTask.save();
  }

  applyForTask(task) {
    let parseTask = new NelpTask();
    parseTask.id = task.objectId;
    let parseApplication = new NelpTaskApplication();
    parseApplication.set('state', NELP_TASK_APPLICATION_STATE.PENDING);
    parseApplication.set('user', Parse.User.current());
    parseApplication.set('task', parseTask);
    parseApplication.set('isNew', true);
    task.application = parseApplication.toJSON(); // TODO(janic): remove this side effect hack.
    parseApplication.save();
  }

  cancelApplyForTask(task) {
    let taskApplication = new NelpTaskApplication();
    taskApplication.id = task.application.objectId;
    taskApplication.set('state', NELP_TASK_APPLICATION_STATE.CANCELED);
    taskApplication.save();
  }

  acceptApplication(application) {
    let parseApplication = new NelpTaskApplication();
    parseApplication.id = application.objectId;
    parseApplication.set('state', NELP_TASK_APPLICATION_STATE.ACCEPTED);
    let parseTask = new NelpTask();
    parseTask.id = application.task.objectId;
    parseTask.set('state', NELP_TASK_STATE.ACCEPTED);

    Parse.Object.saveAll([parseApplication, parseTask]);
  }

  denyApplication(application) {
    let taskApplication = new NelpTaskApplication();
    taskApplication.id = application.objectId;
    taskApplication.set('state', NELP_TASK_APPLICATION_STATE.DENIED);
    taskApplication.save();
  }

  /**
   * Mark the task as viewed.
   * @param {NelpTask} applications applications to mark.
   */
  setTaskViewed(task) {
    let parseApplications = task.applications
      .filter(a => a.isNew)
      .map(a => {
        let parseApplication = new NelpTaskApplication();
        parseApplication.id = a.objectId;
        parseApplication.set('isNew', false);
        return parseApplication;
      });

    Parse.Object.saveAll(parseApplications);
  }
}

export default new ApiUtils();
