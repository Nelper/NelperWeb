import alt from 'app/alt';
import FindNelpActions from 'actions/FindNelpActions';

class FindNelpStore {

  state = {
    myTasks: [],
    createdTask: null,
    error: null,
  }

  constructor() {
    this.bindListeners({
      handleReceivedMyTasks: FindNelpActions.RECEIVED_MY_TASKS,
      handleAddTask: FindNelpActions.ADD_TASK,
      handleStartTaskCreate: FindNelpActions.START_TASK_CREATE,
      handleReceivedCreatedTask: FindNelpActions.RECEIVED_CREATED_TASK,
      handleDeleteTask: FindNelpActions.DELETE_TASK,
      handleAcceptApplication: FindNelpActions.ACCEPT_APPLICATION,
      handleDenyApplication: FindNelpActions.DENY_APPLICATION,
    });
  }

  handleReceivedMyTasks(tasks) {
    this.setState({
      myTasks: tasks,
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
    let newTasks = this.state.myTasks; // Should use immutable data.
    newTasks.unshift(task);
    this.setState({
      myTasks: newTasks,
      createdTask: null,
      error: null,
    });
  }

  handleDeleteTask(task) {
    let newTasks = this.state.myTasks;
    let index = newTasks.findIndex(t => t.objectId === task.objectId);
    newTasks.splice(index, 1);
    this.setState({
      myTasks: newTasks,
    });
  }

  handleAcceptApplication(application) {
    application.state = 2;
    this.emitChange();
  }

  handleDenyApplication(application) {
    application.state = 3;
    this.emitChange();
  }

  handleSetTaskViewed(task) {
    task.applications.forEach(a => a.isNew = false);
    this.emitChange();
  }
}

export default alt.createStore(FindNelpStore, 'FindNelpStore');
