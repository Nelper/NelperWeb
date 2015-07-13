import {Parse} from 'parse';

class ApiUtils {
  listNelpTasks() {
    return new Parse.Query('Task')
      //.notEqualTo('user', Parse.User.current())
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
}

export default new ApiUtils();
