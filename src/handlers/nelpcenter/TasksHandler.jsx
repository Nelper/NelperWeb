import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import TaskCardView from './TaskCardView';
import FindNelpActions from 'actions/FindNelpActions';
import FindNelpStore from 'stores/FindNelpStore';

@connectToStores
export default class TasksHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [FindNelpStore];
  }

  static getPropsFromStores() {
    return FindNelpStore.getState();
  }

  componentDidMount() {
    FindNelpActions.refreshMyTasks();
  }

  render() {
    let {myTasks} = this.props;

    let tasks = myTasks.map((t) => {
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

  /**
   * Sort tasks with isNew first
   */
  _sortTasks(t1, t2) {
    function hasNew(t) {
      return t.applications.some(a => a.state === 0 && a.isNew);
    }

    let [n1, n2] = [hasNew(t1), hasNew(t2)];
    if(n1 === n2) {
      return 0;
    } else if(n1 > n2) {
      return -1;
    } else {
      return 1;
    }
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/center/tasks/detail/${task.objectId}`, null, {task});
  }
}
