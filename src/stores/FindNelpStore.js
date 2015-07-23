import alt from 'app/alt';
import FindNelpActions from 'actions/FindNelpActions';

class FindNelpStore {

  state = {
    myTasks: [],
  }

  constructor() {
    this.bindListeners({
      handleReceivedMyTasks: FindNelpActions.RECEIVED_MY_TASKS,
      handleAddTask: FindNelpActions.ADD_TASK,
      handleAcceptApplication: FindNelpActions.ACCEPT_APPLICATION,
      handleDenyApplication: FindNelpActions.DENY_APPLICATION,
    });
  }

  handleReceivedMyTasks(tasks) {
    this.setState({
      myTasks: tasks,
    });
  }

  handleAddTask(task) {
    let newTasks = this.state.myTasks; // Should use immutable data.
    newTasks.unshift(task);
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
}

export default alt.createStore(FindNelpStore, 'FindNelpStore');
