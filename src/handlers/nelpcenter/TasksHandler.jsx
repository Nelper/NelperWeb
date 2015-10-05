import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';

import TaskCardView from './TaskCardView';

class TasksHandler extends Component {

  static propTypes = {
    me: PropTypes.object,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  /**
   * Sort tasks with isNew first
   */
  _sortTasks(t1, t2) {
    if (t1.node.applications.hasNew === t2.node.applications.hasNew) {
      return 0;
    } else if (t1.node.applications.hasNew) {
      return -1;
    }
    return 1;
  }

  _taskDetail(task) {
    this.context.history.pushState(null, `/center/tasks/detail/${task.id}`);
  }

  render() {
    const {tasks} = this.props.me;
    const displayedTasks = tasks.edges
      .sort(this._sortTasks)
      .map((edge) => {
        const t = edge.node;
        return (
          <TaskCardView
            key={t.id}
            task={t}
            onClick={() => this._taskDetail(t)} />
        );
      });

    return (
      <div className="tasks-handler">
        <div className="container pad-hor-sm">
          {
            !displayedTasks.length ?
            <div className="no-task">
              <div className="no-task-text"><FormattedMessage id="nelpcenter.myTasks.noTask" /></div>
              <Link to="/post"><button className="primary"><FormattedMessage id="nelpcenter.myTasks.post" /></button></Link>
            </div> :
            <div className="tasks">{displayedTasks}</div>
          }
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(TasksHandler, {
  initialVariables: {
    first: 20,
  },
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        tasks(first: $first) {
          edges {
            node {
              id,
              applications {
                hasNew,
              },
              ${TaskCardView.getFragment('task')}
            }
          }
        }
      }
    `,
  },
});
