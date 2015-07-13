import alt from '../alt';
import ApiUtils from '../utils/ApiUtils';

class NelpActions {

  constructor() {
    this.generateActions('updateCity', 'updateCountry');
  }

  refreshTasks() {
    return ApiUtils.listNelpTasks()
      .then((tasks) => {
        this.actions.receivedTasks(tasks);
      });
  }

  receivedTasks(tasks) {
    return tasks;
  }
}

export default alt.createActions(NelpActions);
