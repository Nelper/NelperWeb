import Parse from 'parse';
import Relay from 'react-relay';

import  {NelpTask, NelpTaskApplication, UserPrivateData, Feedback} from './ParseModels';
import {NELP_TASK_STATE, NELP_TASK_APPLICATION_STATE} from 'utils/constants';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import {
  meFromParse,
  userFromParse,
  fixParseFileURL,
} from './ParseUtils';
import patchParse from './patchParse';

patchParse(Parse);

/**
 * Utils for communicating with the backend (Parse).
 */
class ApiUtils {

  /**
   * Logs the user in using email and password.
   * @param  {Object} loginInfo          User login info
   * @param  {string} loginInfo.email    Email address
   * @param  {string} loginInfo.password Password
   * @return {Promise} The logged in user
   */
  login({email, password}) {
    return Parse.User.logIn(email, password)
      .then((user) => {
        this._initSession();
        if (!user.has('privateData')) {
          return this._createUserBase(user);
        }
        return user.get('privateData').fetch();
      })
      .then(() => meFromParse(Parse.User.current()));
  }

  /**
   * Creates an account for the user.
   * @param  {Object} registerInfo          User registration info
   * @param  {string} registerInfo.email    Email address
   * @param  {string} registerInfo.password Password
   * @param  {string} registerInfo.name     Full name
   * @return {Promise} The registered user
   */
  register({email, password, name}) {
    const parseUser = new Parse.User();
    parseUser.set('username', email);
    parseUser.set('email', email);
    parseUser.set('password', password);
    parseUser.set('name', name);
    return parseUser.signUp()
      .then((user) => {
        return this._createUserBase(user);
      })
      .then(() => {
        this._initSession();
        return meFromParse(Parse.User.current());
      });
  }

  /**
   * Logs the user in with Facebook. It will create an accoutn
   * if the user doesn't have one yet.
   *
   * @return {Promise} The logged in user
   */
  loginWithFacebook() {
    return new Promise((resolve, reject) => {
      Parse.FacebookUtils.logIn('email', {
        success: (user) => {
          resolve(user);
        },
        error: (error) => {
          reject(error);
        },
      });
    }).then((user) => {
      return this._getUserInfoFromFacebook()
        .then((fbUser) => {
          user.set('name', fbUser.name);
          user.set('pictureURL', fbUser.picture.data.url);
          if (!user.has('privateData')) {
            this._createUserBase(user);
            user.save();
            return user;
          }

          return user.get('privateData').fetch();
        })
        .then(() => {
          this._initSession();
          return meFromParse(Parse.User.current());
        });
    });
  }

  /**
   * Log out the user.
   */
  logout() {
    Parse.User.logOut();
    if (__CLIENT__) {
      document.cookie = 'p_session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'p_user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  /**
   * Fetch the current user from the server.
   * @return {Promise} The user
   */
  updateUser() {
    return Parse.User.current().fetch()
      .then((user) => {
        return user.get('privateData').fetch();
      })
      .then(() => {
        this._initSession();
        return meFromParse(Parse.User.current());
      });
  }

  getUserSession() {
    const parseUser = Parse.User.current();
    if (!parseUser) {
      return null;
    }
    return parseUser.id + '-' + parseUser.getSessionToken();
  }

  /**
   * Changes the saved user language.
   * @param  {string} lang The language, one of 'fr' or 'en'
   * @return {Promise}     Done saving
   */
  changeLanguage(lang) {
    const privateData = Parse.User.current().get('privateData');
    privateData.set('language', lang);
    return privateData.save();
  }

  /**
   * Sets the user geo location.
   * @param {GeoPoint} loc The user geo point
   */
  setUserLocation(loc) {
    const user = Parse.User.current();
    if (!user) return;
    const pt = new Parse.GeoPoint(loc.latitude, loc.longitude);
    user.set('location', pt);
    user.save();
  }

  /**
   * Add a location for the user.
   * @param {Location} loc The location to add
   */
  addUserLocation(loc) {
    const privateData = Parse.User.current().get('privateData');
    privateData.add('locations', loc);
    return privateData.save();
  }

  deleteUserLocation(loc) {
    const privateData = Parse.User.current().get('privateData');
    const parseLocation = privateData.get('locations').find(l => l.name === loc.name);
    privateData.remove('locations', parseLocation);
    return privateData.save();
  }

  /**
   * Set the user profile picture.
   * @param {File} file The picture's file
   */
  setUserPicture(file) {
    const user = Parse.User.current();
    user.set('customPicture', file.file);
    return user.save().then(u => {
      return this._fileFromParse(u.get('customPicture'));
    });
  }

  /**
   * Edit the user's profile about section
   * @param {string} about About text
   */
  editUserAbout(about) {
    const user = Parse.User.current();
    user.set('about', about);
    return user.save();
  }

  /**
   * Adds a skill to the user's profile.
   * @param {Skill} skill The skill to add
   */
  addUserSkill(skill) {
    const user = Parse.User.current();
    user.add('skills', skill);
    user.save();
  }

  /**
   * Edit a skill in the user's profile.
   * @param {Skill} skill The skill to edit
   */
  editUserSkill(skill) {
    const user = Parse.User.current();
    const userSkills = user.get('skills');
    const index = userSkills.findIndex(s => s.objectId === skill.objectId);
    userSkills[index] = skill;
    user.save();
  }

  /**
   * Delete a skill in the user's profile.
   * @param {Skill} skill The skill to delete
   */
  deleteUserSkill(skill) {
    const user = Parse.User.current();
    user.remove('skills', skill);
    user.save();
  }

  /**
   * Add an experience item to the user's profile.
   * @param {Experience} exp The experience
   */
  addUserExperience(exp) {
    const user = Parse.User.current();
    user.add('experience', exp);
    user.save();
  }

  /**
   * Edit an experience item on the user's profile.
   * @param {Experience} exp The experience
   */
  editUserExperience(exp) {
    const user = Parse.User.current();
    const userExp = user.get('experience');
    const index = userExp.findIndex(e => e.objectId === exp.objectId);
    userExp[index] = exp;
    user.save();
  }

  /**
   * Delete an experience item from the user's profile.
   * @param {Experience} exp The experience
   */
  deleteUserExperience(exp) {
    const user = Parse.User.current();
    user.remove('experience', exp);
    user.save();
  }

  /**
   * Add an education item to the user's profile.
   * @param {Education} ed The education
   */
  addUserEducation(ed) {
    const user = Parse.User.current();
    user.add('education', ed);
    user.save();
  }

  /**
   * Edit an education item on the user's profile.
   * @param {Education} ed The education
   */
  editUserEducation(ed) {
    const user = Parse.User.current();
    const userExp = user.get('education');
    const index = userExp.findIndex(e => e.objectId === ed.objectId);
    userExp[index] = ed;
    user.save();
  }

  /**
   * Delete an education item from the user's profile.
   * @param {Education} ed The education
   */
  deleteUserEducation(ed) {
    const user = Parse.User.current();
    user.remove('education', ed);
    user.save();
  }

  refreshFeedback(user) {
    const parseUser = new Parse.User();
    parseUser.id = user.objectId;
    return new Parse.Query(Feedback)
      .include('poster')
      .include('task')
      .equalTo('user', parseUser)
      .descending('createdAt')
      .find()
      .then(parseFeedback => {
        return parseFeedback.map(parseItem => {
          const item = parseItem.toPlainObject();
          item.poster = parseItem.get('poster').toPlainObject();
          item.task = parseItem.get('task').toPlainObject();
          return item;
        });
      });
  }

  /**
   * List all tasks near a point.
   * @param {object} filters Filters for the query
   * @param {Array<string>} filters.categories Categories to include in the query
   * @param {'date'|'distance'} filters.sort Sort order for the query
   * @param {GeoPoint} location The user location for the distance sort filter
   * @return {Promise} The list of tasks
   */
  listNelpTasks({categories, minPrice, maxDistance, sort = 'date', skip = 0, limit = 20}, location) {
    const taskQuery = new Parse.Query(NelpTask);
    const point = new Parse.GeoPoint(location);

    // Filter by category. Dont add the filter if all categories are selected.
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
    case 'distance':
      taskQuery.near('location', point);
      break;
    case 'price':
      taskQuery.descending('priceOffered');
      break;
    case 'date':
    default:
      taskQuery.descending('createdAt');
      break;
    }

    return taskQuery
      .include('user')
      // .notEqualTo('user', Parse.User.current())
      .equalTo('state', NELP_TASK_STATE.PENDING)
      .skip(skip)
      .limit(limit)
      .find()
      .then((tasks) => {
        if (Parse.User.current()) {
          return new Parse.Query(NelpTaskApplication)
            .equalTo('user', Parse.User.current())
            .equalTo('state', NELP_TASK_APPLICATION_STATE.PENDING)
            .containedIn('task', tasks)
            .find()
            .then((applications) => {
              return tasks.map((t) => {
                const application = applications.find((a) => a.get('task').id === t.id);
                const task = this._baseTaskFromParse(t);
                task.user = userFromParse(t.get('user'));
                task.application = application && application.toPlainObject();
                return task;
              });
            });
        }

        return tasks.map((t) => {
          const task = this._baseTaskFromParse(t);
          task.user = userFromParse(t.get('user'));
          return task;
        });
      });
  }

  /**
   * List all of the user's tasks.
   * @return {Promise} The tasks
   */
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
            return tasks.map((parseTask) => {
              const taskApplications = applications.filter((a) => {
                return a.get('task').id === parseTask.id;
              })
              .sort((ta1, ta2) => ta1.createdAt < ta2.createdAt ? 1 : -1);
              const task = this._baseTaskFromParse(parseTask);
              task.applications = taskApplications.map(a => {
                return {
                  objectId: a.id,
                  createdAt: a.createdAt,
                  isNew: a.get('isNew'),
                  state: a.get('state'),
                  price: a.get('price'),
                  user: userFromParse(a.get('user')),
                  task: task,
                };
              });
              // TODO: make this a getter on the task object
              task.isNew = task.applications.some(t => t.isNew);
              return task;
            });
          });
      });
  }

  /**
   * List all of the user's applications.
   * @return {Promise} The applications
   */
  listMyApplications() {
    return new Parse.Query(NelpTaskApplication)
      .include('task.user')
      .equalTo('user', Parse.User.current())
      .notEqualTo('state', NELP_TASK_APPLICATION_STATE.CANCELED)
      .descending('createdAt')
      .find()
      .then(applications => {
        return applications.map(a => {
          const task = this._baseTaskFromParse(a.get('task'));
          task.user = userFromParse(a.get('task').get('user'));
          return {
            objectId: a.id,
            createdAt: a.createdAt,
            state: a.get('state'),
            task: task,
            price: a.get('price'),
            acceptedAt: a.get('acceptedAt'),
          };
        });
      });
  }

  /**
   * Create a new task.
   * @param {Task} task The task to create
   */
  addTask(task) {
    const parseTask = new NelpTask();
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

    const acl = new Parse.ACL(Parse.User.current());
    acl.setPublicReadAccess(true);
    parseTask.setACL(acl);

    return parseTask.save()
      .then(t => {
        const newTask = this._baseTaskFromParse(t);
        newTask.applications = [];
        newTask.isNew = false;
        return newTask;
      });
  }

  /**
   * Update a task.
   * @param  {Task} task The task to update
   */
  updateTask(task) {
    const parseTask = new NelpTask();
    parseTask.id = task.objectId;
    parseTask.set('desc', task.desc);
    parseTask.save();
  }

  addTaskPicture(task, picture) {
    const parseTask = new NelpTask();
    parseTask.id = task.objectId;
    const parsePictures = task.pictures
      .concat([picture])
      .map(p => {
        return {
          __type: 'File',
          name: p.name,
          url: p.url,
        };
      });
    parseTask.set('pictures', parsePictures);
    parseTask.save();
  }

  deleteTaskPicture(task, picture) {
    const parseTask = new NelpTask();
    parseTask.id = task.objectId;
    const parsePictures = task.pictures
      .filter(p => p !== picture)
      .map(p => {
        return {
          __type: 'File',
          name: p.name,
          url: p.url,
        };
      });
    parseTask.set('pictures', parsePictures);
    parseTask.save();
  }

  /**
   * Delete a task.
   * @param  {Task} task The task to delete
   */
  deleteTask(task) {
    const parseTask = new NelpTask();
    parseTask.id = task.objectId;
    parseTask.set('state', NELP_TASK_STATE.DELETED);
    parseTask.save();
  }

  /**
   * Create an application for the user on a task.
   * @param  {Task} task The task to apply on
   */
  applyForTask(task, price) {
    const parseTask = new NelpTask();
    parseTask.id = task.objectId;
    const parseApplication = new NelpTaskApplication();
    parseApplication.set('state', NELP_TASK_APPLICATION_STATE.PENDING);
    parseApplication.set('user', Parse.User.current());
    parseApplication.set('task', parseTask);
    parseApplication.set('isNew', true);
    parseApplication.set('price', price);
    task.application = parseApplication.toPlainObject(); // TODO(janic): remove this side effect hack.
    parseApplication.save();
  }

  /**
   * Cancel an application on a task.
   * @param  {Task} task The task to cancel the application on
   */
  cancelApplyForTask(task) {
    const taskApplication = new NelpTaskApplication();
    taskApplication.id = task.application.objectId;
    taskApplication.set('state', NELP_TASK_APPLICATION_STATE.CANCELED);
    taskApplication.save();
  }

  /**
   * Accept an application on a task.
   * @param  {Application} application The application to accept
   */
  acceptApplication(application) {
    const parseApplication = new NelpTaskApplication();
    parseApplication.id = application.objectId;
    parseApplication.set('state', NELP_TASK_APPLICATION_STATE.ACCEPTED);
    parseApplication.set('acceptedAt', new Date());
    const parseTask = new NelpTask();
    parseTask.id = application.task.objectId;
    parseTask.set('state', NELP_TASK_STATE.ACCEPTED);

    Parse.Object.saveAll([parseApplication, parseTask]);
  }

  /**
   * Deny an application on a task.
   * @param  {Application} application The application to deny
   */
  denyApplication(application) {
    const taskApplication = new NelpTaskApplication();
    taskApplication.id = application.objectId;
    taskApplication.set('state', NELP_TASK_APPLICATION_STATE.DENIED);
    taskApplication.save();
  }

  /**
   * Restore an application to pending on a task.
   * @param  {Application} application The application to deny
   */
  restoreApplication(application) {
    const taskApplication = new NelpTaskApplication();
    taskApplication.id = application.objectId;
    taskApplication.set('state', NELP_TASK_APPLICATION_STATE.PENDING);
    taskApplication.save();
  }

  /**
   * Mark a task as viewed.
   * @param {Task} task The task to mask as viewed
   */
  setTaskViewed(task) {
    const parseApplications = task.applications
      .filter(a => a.isNew)
      .map(a => {
        const parseApplication = new NelpTaskApplication();
        parseApplication.id = a.objectId;
        parseApplication.set('isNew', false);
        return parseApplication;
      });

    Parse.Object.saveAll(parseApplications);
  }

  /**
   * Requests the task poster contact info.
   * @param  {TaskApplication} application The application for which the infos are requested
   * @return {Promise} The contact info
   */
  requestTaskPosterInfo(application) {
    return Parse.Cloud.run('taskPosterInfo', {applicationId: application.objectId});
  }

  /**
   * Requests the applicant contact info.
   * @param  {TaskApplication} application The application for which the infos are requested
   * @return {Promise} The contact info
   */
  requestApplicantInfo(application) {
    return Parse.Cloud.run('applicantInfo', {applicationId: application.objectId});
  }

  /**
   * Upload a file to the file server.
   * @param  {string} name The name of the file
   * @param  {FormData} file The file as FormData
   * @return {Promise} Info about the uploaded file
   */
  uploadFile(name, file) {
    const parseFile = new Parse.File(name, file);
    return parseFile.save()
      .then((f) => {
        return this._fileFromParse(f);
      });
  }

  _initSession() {
    if (__CLIENT__) {
      const parseSessionToken = Parse.User.current().getSessionToken();
      const parseUserId = Parse.User.current().id;
      document.cookie = `p_session=${parseSessionToken}`;
      document.cookie = `p_user=${parseUserId}`;
      Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer('/graphql', {
          headers: {
            Authorization: this.getUserSession(),
          },
        })
      );
    }
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
    const pictures = parseTask.get('pictures');
    return pictures && pictures.map(p => {
      return this._fileFromParse(p);
    });
  }

  _createUserBase(user) {
    user.set('about', '');
    user.set('skills', []);
    user.set('education', []);
    user.set('experience', []);
    const userPrivate = new UserPrivateData();
    userPrivate.set('locations', []);
    userPrivate.set('notifications', {
      posterApplication: {
        email: true,
      },
      posterRequestPayment: {
        email: true,
      },
      nelperApplicationStatus: {
        email: true,
      },
      nelperReceivedPayment: {
        email: true,
      },
      newsletter: {
        email: true,
      },
    });
    userPrivate.setACL(new Parse.ACL(user));
    return userPrivate.save()
      .then(p => {
        user.set('privateData', p);
        return user.save();
      });
  }

  _fileFromParse(parseFile) {
    return {
      url: fixParseFileURL(parseFile.url()),
      file: parseFile,
      name: parseFile.name(),
      objectId: parseFile.name(),
    };
  }

  /**
   * Gets additional info about the user from Facebook
   * using the Facebook Graph API.
   * @private
   * @return {Promise} Info from Facebook
   */
  _getUserInfoFromFacebook() {
    return new Promise((resolve, reject) => {
      FB.api('me?fields=name,picture.type(large)', (response) => {
        if (response.error) {
          reject(response.error);
          return;
        }
        resolve(response);
      });
    });
  }
}

export default new ApiUtils();
