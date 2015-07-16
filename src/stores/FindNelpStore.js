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
    });
  }

  handleReceivedMyTasks(tasks) {
    this.setState({
      myTasks: tasks,
    });
  }

  handleAddTask(task) {
    let newTasks = this.state.myTasks; // Should use immutable data.
    newTasks.push(task);
    this.setState({
      myTasks: newTasks,
    });
  }
}

export default alt.createStore(FindNelpStore);
