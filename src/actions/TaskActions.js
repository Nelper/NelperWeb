import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';
import {TASK_STATE} from 'utils/constants';

class TaskActions {

  constructor() {
    this.generateActions(
      'receivedMyTasks',
      'startTaskCreate',
      'receivedCreatedTask',
      'receivedApplicantInfo',
      'receivedApplicantFeedback',
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
    task.isNew = false;
    task.state = TASK_STATE.PENDING;
    task.createdAt = new Date();
    ApiUtils.addTask(task)
      .then((t) => {
        this.actions.receivedCreatedTask(t);
      });
    return task;
  }

  updateTask(task) {
    ApiUtils.updateTask(task);
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

  restoreApplication(application) {
    ApiUtils.restoreApplication(application);
    return application;
  }

  addPicture(task, picture) {
    ApiUtils.addTaskPicture(task, picture);
    return {task, picture};
  }

  deletePicture(task, picture) {
    ApiUtils.deleteTaskPicture(task, picture);
    return {task, picture};
  }

  requestApplicantInfo(application) {
    ApiUtils.requestApplicantInfo(application)
      .then(info => {
        this.actions.receivedApplicantInfo({application, info});
      });
  }

  refreshApplicantFeedback(application) {
    ApiUtils.refreshFeedback(application.user)
      .then(feedback => {
        this.actions.receivedApplicantFeedback({application, feedback});
      });
  }
}

export default alt.createActions(TaskActions);
