import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import TaskCardView from './TaskCardView';
import TaskActions from 'actions/TaskActions';
import TaskStore from 'stores/TaskStore';

@connectToStores
export default class TasksHandler extends Component {

  static propTypes = {
    myTasks: PropTypes.array,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [TaskStore];
  }

  static getPropsFromStores() {
    return TaskStore.getState();
  }

  componentDidMount() {
    TaskActions.refreshMyTasks();
  }

  /**
   * Sort tasks with isNew first
   */
  _sortTasks(t1, t2) {
    function hasNew(t) {
      return t.applications.some(a => a.state === 0 && a.isNew);
    }

    const [n1, n2] = [hasNew(t1), hasNew(t2)];
    if (n1 === n2) {
      return 0;
    } else if (n1 > n2) {
      return -1;
    }
    return 1;
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/center/tasks/detail/${task.objectId}`, null, {task});
  }

  render() {
    const {myTasks} = this.props;

    const tasks = myTasks.map((t) => {
      return (
        <TaskCardView
          key={t.objectId}
          task={t}
          onClick={() => this._taskDetail(t)} />
      );
    });

    return (
      <div className="tasks-handler">
        <div className="container pad-all tasks">
          {tasks}
        </div>
      </div>
    );
  }
}
