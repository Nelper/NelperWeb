import alt from 'app/alt';
import BrowseActions from 'actions/BrowseActions';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

class NelpStore {

  state = {
    tasks: [],
  }

  constructor() {
    this.bindListeners({
      handleReceivedTasks: BrowseActions.RECEIVED_TASKS,
      handleApply: BrowseActions.APPLY_FOR_TASK,
      handleCancelApply: BrowseActions.CANCEL_APPLY_FOR_TASK,
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
