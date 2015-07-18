import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

class NelpActions {

  constructor() {
    this.generateActions('receivedTasks');
  }

  refreshTasks() {
    ApiUtils.listNelpTasks()
      .then((tasks) => {
        this.actions.receivedTasks(tasks);
      });
  }

  applyForTask(task) {
    ApiUtils.applyForTask(task);
  }

  cancelApplyForTask(task) {
    ApiUtils.cancelApplyForTask(task);
  }
}

export default alt.createActions(NelpActions);
