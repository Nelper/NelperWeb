import alt from '../alt';
import ApiUtils from '../utils/ApiUtils';

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
}

export default alt.createActions(NelpActions);
