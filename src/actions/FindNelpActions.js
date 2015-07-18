import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

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

  acceptApplication(application) {
    ApiUtils.acceptApplication(application);
    return application;
  }

  denyApplication(application) {
    ApiUtils.denyApplication(application);
    return application;
  }
}

export default alt.createActions(FindNelpActions);
