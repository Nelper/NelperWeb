import {Parse} from 'parse';

import './ParsePatches';
import {NELP_TASK_STATE, NELP_TASK_APPLICATION_STATE} from 'utils/constants';

const NelpTask = Parse.Object.extend({className: 'NelpTask'});
const NelpTaskApplication = Parse.Object.extend({className: 'NelpTaskApplication'});
const UserPrivateData = Parse.Object.extend({className: 'UserPrivateData'});

class ApiUtils {

  login(email, password) {
    return Parse.User.logIn(email, password)
      .then((user) => {
        return user.get('privateData').fetch();
      })
      .then(() => this._meFromParse(Parse.User.current()));
  }

  register(email, password, name) {
    let user = new Parse.User();
    user.set('username', email);
    user.set('email', email);
    user.set('password', password);
    user.set('name', name);
    return user.signUp()
      .then((user) => {
        this._createUserBase(user);
        user.save();
        return user;
      })
      .then(this._meFromParse);
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
          if(!user.has('privateData')) {
            this._createUserBase(user);
            user.save();
            return user;
          } else {
            return user.get('privateData').fetch();
          }
        })
        .then(() => this._meFromParse(Parse.User.current()));
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
      .then((user) => {
        return user.get('privateData').fetch();
      })
      .then(() => this._meFromParse(Parse.User.current()));
  }

  setUserLocation(loc) {
    let pt = new Parse.GeoPoint(loc.latitude, loc.longitude);
    let user = Parse.User.current();
    user.set('location', pt);
    user.save();
  }

  addUserLocation(loc) {
    let privateData = Parse.User.current().get('privateData');
    privateData.add('locations', loc);
    privateData.save();
  }

  setUserPicture(file) {
    let user = Parse.User.current();
    user.set('customPicture', file.file);
    user.save();
  }

  editUserAbout(about) {
    let user = Parse.User.current();
    user.set('about', about);
    user.save();
  }

  addUserSkill(skill) {
    let user = Parse.User.current();
    user.add('skills', skill);
    user.save();
  }

  editUserSkill(skill) {
    let user = Parse.User.current();
    let userSkills = user.get('skills');
    let index = userSkills.findIndex(s => s.objectId === skill.objectId);
    userSkills[index] = skill;
    user.save();
  }

  deleteUserSkill(skill) {
    let user = Parse.User.current();
    user.remove('skills', skill);
    user.save();
  }

  addUserExperience(exp) {
    let user = Parse.User.current();
    user.add('experience', exp);
    user.save();
  }

  editUserExperience(exp) {
    let user = Parse.User.current();
    let userExp = user.get('experience');
    let index = userExp.findIndex(e => e.objectId === exp.objectId);
    userExp[index] = exp;
    user.save();
  }

  deleteUserExperience(exp) {
    let user = Parse.User.current();
    user.remove('experience', exp);
    user.save();
  }

  logout() {
    Parse.User.logOut();
  }

  listNelpTasks(/*filters*/) {
    return new Parse.Query(NelpTask)
      .include('user')
      //.notEqualTo('user', Parse.User.current())
      .equalTo('state', NELP_TASK_STATE.PENDING)
      .descending('createdAt')
      .limit(20)
      .find()
      .then((tasks) => {
        if(Parse.User.current()) {
          return new Parse.Query(NelpTaskApplication)
            .equalTo('user', Parse.User.current())
            .equalTo('state', NELP_TASK_APPLICATION_STATE.PENDING)
            .containedIn('task', tasks)
            .find()
            .then((applications) => {
              return tasks.map((t) => {
                let application = applications.find((a) => a.get('task').id === t.id);
                let task = this._baseTaskFromParse(t);
                task.user = this._userFromParse(t.get('user'));
                task.application = application && application.toPlainObject();
                return task;
              });
            });
        } else {
          return tasks.map((t) => {
            let task = this._baseTaskFromParse(t);
            task.user = this._userFromParse(t.get('user'));
            return task;
          });
        }
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
              let task = this._baseTaskFromParse(t);
              task.applications = taskApplications.map(a => {
                return {
                  objectId: a.id,
                  createdAt: a.createdAt,
                  isNew: a.get('isNew'),
                  state: a.get('state'),
                  user: this._userFromParse(a.get('user')),
                  task: task,
                };
              });
              task.isNew = task.applications.some(t => t.isNew);
              return task;
            });
          });
      });
  }

  listMyApplications() {
    return new Parse.Query(NelpTaskApplication)
      .include('task.user')
      .equalTo('user', Parse.User.current())
      .notEqualTo('state', NELP_TASK_APPLICATION_STATE.CANCELED)
      .descending('createdAt')
      .limit(20)
      .find()
      .then(applications => {
        return applications.map(a => {
          let task = this._baseTaskFromParse(a.get('task'));
          task.user = this._userFromParse(a.get('task').get('user'));
          return {
            objectId: a.id,
            createdAt: a.createdAt,
            state: a.get('state'),
            task: task,
          }
        });
      });
  }

  addTask(task) {
    let parseTask = new NelpTask();
    parseTask.set('title', task.title);
    parseTask.set('category', task.category);
    parseTask.set('desc', task.desc);
    parseTask.set('priceOffered', task.priceOffered);
    parseTask.set('state', task.state);
    parseTask.set('location', new Parse.GeoPoint(task.location));
    parseTask.set('city', task.city);
    parseTask.set('user', Parse.User.current());
    parseTask.set('pictures', task.pictures.map(p => {
      return {
        __type: 'File',
        name: p.name,
        url: p.url,
      };
    }));
    return parseTask.save()
      .then(t => {
        let newtask = this._baseTaskFromParse(t);
        newtask.applications = [];
        return newtask;
      });
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
    task.application = parseApplication.toPlainObject(); // TODO(janic): remove this side effect hack.
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

  uploadFile(name, file) {
    let parseFile = new Parse.File(name, file);
    return parseFile.save()
      .then((f) => {
        return {
          url: f.url(),
          file: parseFile,
          objectId: f.name(),
        };
      });
  }

  _meFromParse(parseUser) {
    let user = this._userFromParse(parseUser);
    user.privateData = parseUser.get('privateData').toPlainObject();
    return user;
  }

  _userFromParse(parseUser) {
    let user = parseUser.toPlainObject();
    // If the user has uploaded a picture we use it.
    if(parseUser.get('customPicture')) {
      user.pictureURL = parseUser.get('customPicture').url();
    }
    return user;
  }

  _baseTaskFromParse(parseTask) {
    return {
      objectId: parseTask.id,
      createdAt: parseTask.createdAt,
      title: parseTask.get('title'),
      category: parseTask.get('category'),
      desc: parseTask.get('desc'),
      priceOffered: parseTask.get('priceOffered'),
      location: parseTask.get('location'),
      city: parseTask.get('city'),
      state: parseTask.get('state'),
      pictures: this._taskPictures(parseTask),
    };
  }

  _taskPictures(parseTask) {
    let pictures = parseTask.get('pictures');
    return pictures && pictures.map(p => {
      return {
        url: p.url(),
        name: p.name(),
      };
    });
  }

  _createUserBase(user) {
    user.set('about', '');
    user.set('skills', []);
    user.set('experience', []);
    let userPrivate = new UserPrivateData();
    userPrivate.set('locations', []);
    userPrivate.setACL(new Parse.ACL(user));
    user.set('privateData', userPrivate);
  }
}

export default new ApiUtils();
