import {Parse} from 'parse';

const NelpTask = new Parse.Object.extend({className: 'NelpTask'});
const TaskApplication = new Parse.Object.extend({className: 'NelpTaskApplication'});

class ApiUtils {

  login(email, password) {

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
          user.set('firstName', fbUser.first_name);
          user.set('lastName', fbUser.last_name);
          user.set('pictureURL', fbUser.picture.data.url);
          user.save();
          return user.toPlainObject();
        });
    });
  }

  getUserInfoFromFacebook() {
    return new Promise((resolve, reject) => {
      FB.api('me?fields=first_name,last_name,picture.type(large)', (response) => {
        if(response.error) {
          reject(response.error);
          return;
        }
        resolve(response);
      });
    });
  }

  listNelpTasks() {
    return new Parse.Query(NelpTask)
      //.notEqualTo('user', Parse.User.current())
      .descending('dateCreated')
      .limit(20)
      .find()
      .then((tasks) => {
        return new Parse.Query(TaskApplication)
          .equalTo('user', Parse.User.current())
          .containedIn('task', tasks)
          .find()
          .then((applications) => {
            return tasks.map((t) => {
              let application = applications.find((a) => a.get('task').id === t.id);
              return {
                objectId: t.id,
                title: t.get('title'),
                desc: t.get('desc'),
                application: application && application.toPlainObject(),
              };
            });
          });
      });
  }

  listMyNelpTasks() {
    return new Parse.Query(NelpTask)
      .equalTo('user', Parse.User.current())
      .find()
      .then((tasks) => {
        return new Parse.Query(TaskApplication)
          .containedIn('task', tasks)
          .find()
          .then((applications) => {
            return tasks.map((t) => {
              let taskApplications = applications.filter((a) => {
                return a.get('task').id === t.id;
              });
              return {
                objectId: t.id,
                title: t.get('title'),
                desc: t.get('desc'),
                applications: taskApplications.map(a => a.toPlainObject()),
              };
            });
          });
      });
  }

  addTask(task) {
    let parseTask = new NelpTask();
    parseTask.set('title', task.title);
    parseTask.set('desc', task.desc);
    parseTask.set('user', Parse.User.current());
    parseTask.save();
  }

  applyTask() {

  }
}

export default new ApiUtils();
