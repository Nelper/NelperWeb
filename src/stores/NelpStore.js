import alt from '../alt';
import NelpActions from '../actions/NelpActions';

class NelpStore {

  state = {
    tasks: [],
  }

  constructor() {
    this.bindListeners({
      handleReceivedTasks: NelpActions.RECEIVED_TASKS,
    });
  }

  handleReceivedTasks(tasks) {
    this.setState({
      tasks: tasks,
    });
  }
}

export default alt.createStore(NelpStore);
