import alt from '../alt';
import ApiUtils from '../utils/ApiUtils';

class FindNelpActions {

  constructor() {
    this.generateActions('receivedMyTasks');
  }

  refreshMyTasks() {
    ApiUtils.listMyNelpTasks()
    .then((tasks) => {
      this.actions.receivedMyTasks(tasks);
    });
  }

  addTask(task) {
    ApiUtils.addTask(task);
  }
}

export default alt.createActions(FindNelpActions);
