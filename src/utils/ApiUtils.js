import {Parse} from 'parse';

const Task = new Parse.Object.extend({className: 'Task'});
const TaskApplication = new Parse.Object.extend({className: 'TaskApplication'});

class ApiUtils {
  listNelpTasks() {
    return new Parse.Query('Task')
      .notEqualTo('user', Parse.User.current())
      .descending('dateCreated')
      .limit(20)
      .find()
      .then((tasks) => {
        return new Parse.Query('TaskApplication')
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
    return new Parse.Query('Task')
      .equalTo('user', Parse.User.current())
      .find()
      .then((tasks) => {
        return tasks.map(t => t.toPlainObject());
      });
  }

  addTask(task) {
    let parseTask = new Task();
    parseTask.set('title', task.title);
    parseTask.set('desc', task.desc);
    parseTask.set('user', Parse.User.current());
    parseTask.save();
  }
}

export default new ApiUtils();
