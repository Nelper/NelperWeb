import alt from 'app/alt';
import NelpActions from 'actions/NelpActions';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

class NelpStore {

  state = {
    tasks: [],
  }

  constructor() {
    this.bindListeners({
      handleReceivedTasks: NelpActions.RECEIVED_TASKS,
      handleApply: NelpActions.APPLY_FOR_TASK,
      handleCancelApply: NelpActions.CANCEL_APPLY_FOR_TASK,
    });
  }

  handleReceivedTasks(tasks) {
    this.setState({
      tasks: tasks,
    });
  }

  handleApply(task) {
    task.application = {
      state: NELP_TASK_APPLICATION_STATE.PENDING,
    };
    this.emitChange();
  }

  handleCancelApply(task) {
    task.application = null;
    this.emitChange();
  }
}

export default alt.createStore(NelpStore, 'NelpStore');
