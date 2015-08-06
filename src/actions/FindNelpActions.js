import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';
import {NELP_TASK_STATE} from 'utils/constants';

class FindNelpActions {

  constructor() {
    this.generateActions(
      'receivedMyTasks',
      'startTaskCreate',
      'receivedCreatedTask',
    );
  }

  refreshMyTasks() {
    ApiUtils.listMyNelpTasks()
    .then((tasks) => {
      this.actions.receivedMyTasks(tasks);
    });
  }

  addTask(task) {
    task.applications = [];
    task.isNew = true;
    task.state = NELP_TASK_STATE.PENDING;
    ApiUtils.addTask(task)
      .then((t) => {
        this.actions.receivedCreatedTask(t);
      });
    return task;
  }

  deleteTask(task) {
    ApiUtils.deleteTask(task);
    return task;
  }

  setTaskViewed(task) {
    ApiUtils.setTaskViewed(task);
    return task;
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
