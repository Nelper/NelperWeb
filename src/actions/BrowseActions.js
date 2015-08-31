import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

class BrowseActions {

  constructor() {
    this.generateActions('receivedTasks');
  }

  refreshTasks(filter, location) {
    ApiUtils.listNelpTasks(filter, location)
      .then((tasks) => {
        this.actions.receivedTasks({tasks, filter});
      }).fail(err => {
        console.log(err);
      });
  }

  applyForTask(task, price) {
    ApiUtils.applyForTask(task, price);
    return task;
  }

  cancelApplyForTask(task) {
    ApiUtils.cancelApplyForTask(task);
    return task;
  }
}

export default alt.createActions(BrowseActions);
