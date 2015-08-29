import alt from 'app/alt';
import BrowseActions from 'actions/BrowseActions';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

class BrowseStore {

  state = {
    tasks: [],
    filter: {},
  }

  constructor() {
    this.bindListeners({
      handleReceivedTasks: BrowseActions.RECEIVED_TASKS,
      handleApply: BrowseActions.APPLY_FOR_TASK,
      handleCancelApply: BrowseActions.CANCEL_APPLY_FOR_TASK,
    });
  }

  handleReceivedTasks({tasks, filter}) {
    // If the filter changed discard old tasks.
    if (filter.sort !== this.state.filter.sort ||
        filter.categories !== this.state.filter.categories ||
        filter.minPrice !== this.state.filter.minPrice ||
        filter.maxDistance !== this.state.filter.maxDistance) {
      this.setState({
        tasks,
        filter,
      });
    } else {
      // Merge new tasks with the old ones.
      // TODO: Should probably use a Map to optimise this.
      const newTasks = [...this.state.tasks];
      const curTasks = this.state.tasks;
      for (const task of tasks) {
        const index = curTasks.findIndex(t => t.objectId === task.objectId);
        if (index < 0) {
          newTasks.push(task);
        } else {
          newTasks[index] = task;
        }
      }
      this.setState({
        tasks: newTasks,
        filter,
      });
    }
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

export default alt.createStore(BrowseStore, 'BrowseStore');
