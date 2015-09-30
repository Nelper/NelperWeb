import alt from 'app/alt';
import TaskActions from 'actions/TaskActions';
import {TASK_APPLICATION_STATE} from 'utils/constants';

class TaskStore {

  state = {
    myTasks: [],
    isLoading: true,
    createdTask: null,
    error: null,
  }

  constructor() {
    this.bindListeners({
      handleReceivedMyTasks: TaskActions.RECEIVED_MY_TASKS,
      handleAddTask: TaskActions.ADD_TASK,
      handleStartTaskCreate: TaskActions.START_TASK_CREATE,
      handleReceivedCreatedTask: TaskActions.RECEIVED_CREATED_TASK,
      handleDeleteTask: TaskActions.DELETE_TASK,
      handleUpdateTask: TaskActions.UPDATE_TASK,
      handleAcceptApplication: TaskActions.ACCEPT_APPLICATION,
      handleDenyApplication: TaskActions.DENY_APPLICATION,
      handleRestoreApplication: TaskActions.RESTORE_APPLICATION,
      handleSetTaskViewed: TaskActions.SET_TASK_VIEWED,
      handleAddPicture: TaskActions.ADD_PICTURE,
      handleDeletePicture: TaskActions.DELETE_PICTURE,
      handleReceivedApplicantInfo: TaskActions.RECEIVED_APPLICANT_INFO,
      handleReceivedApplicantFeedback: TaskActions.RECEIVED_APPLICANT_FEEDBACK,
    });
  }

  handleReceivedMyTasks(tasks) {
    this.setState({
      myTasks: tasks,
      isLoading: false,
    });
  }

  handleStartTaskCreate() {
    this.setState({
      createdTask: null,
    });
  }

  handleReceivedCreatedTask(task) {
    this.setState({
      createdTask: task,
    });
  }

  handleAddTask(task) {
    const newTasks = this.state.myTasks; // Should use immutable data.
    newTasks.unshift(task);
    this.setState({
      myTasks: newTasks,
      createdTask: null,
      error: null,
    });
  }

  handleDeleteTask(task) {
    const newTasks = this.state.myTasks;
    const index = newTasks.findIndex(t => t.objectId === task.objectId);
    newTasks.splice(index, 1);
    this.setState({
      myTasks: newTasks,
    });
  }

  handleUpdateTask(task) {
    const newTasks = this.state.myTasks;
    const index = newTasks.findIndex(t => t.objectId === task.objectId);
    newTasks[index] = task;
    this.setState({
      myTasks: newTasks,
    });
  }

  handleAcceptApplication(application) {
    application.state = TASK_APPLICATION_STATE.ACCEPTED;
    this.emitChange();
  }

  handleDenyApplication(application) {
    application.state = TASK_APPLICATION_STATE.DENIED;
    this.emitChange();
  }

  handleRestoreApplication(application) {
    application.state = TASK_APPLICATION_STATE.PENDING;
    this.emitChange();
  }

  handleSetTaskViewed(task) {
    task.applications.forEach(a => a.isNew = false);
    task.isNew = false;
    this.emitChange();
  }

  handleAddPicture({task, picture}) {
    task.pictures.push(picture);
    this.emitChange();
  }

  handleDeletePicture({task, picture}) {
    const index = task.pictures.findIndex(p => p === picture);
    task.pictures.splice(index, 1);
    this.emitChange();
  }

  handleReceivedApplicantInfo({application, info}) {
    application.hasApplicantInfo = true;
    application.phone = info.phone;
    application.email = info.email;
    this.emitChange();
  }

  handleReceivedApplicantFeedback({application, feedback}) {
    application.user.feedback = feedback;
    this.emitChange();
  }
}

export default alt.createStore(TaskStore, 'TaskStore');
