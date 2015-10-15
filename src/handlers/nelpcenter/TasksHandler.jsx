import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';

import TaskCardView from './TaskCardView';

import styles from './TasksHandler.scss';

@cssModules(styles)
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

  _renderTaskEdge(edge) {
    const t = edge.node;
    return (
      <TaskCardView
        key={t.id}
        task={t}
        onClick={() => this._taskDetail(t)} />
    );
  }

  render() {
    const {tasks} = this.props.me;
    const activeTasks = tasks.edges
      .filter(edge => edge.node.state !== 'COMPLETED')
      .sort(this._sortTasks)
      .map(this._renderTaskEdge);

    const completedTasks = tasks.edges
      .filter(edge => edge.node.state === 'COMPLETED')
      .sort(this._sortTasks)
      .map(this._renderTaskEdge);

    return (
      <div styleName="tasks-handler">
        <div className="container pad-hor-sm">
          {
            !activeTasks.length ?
            <div styleName="no-task">
              <div styleName="no-task-text"><FormattedMessage id="nelpcenter.myTasks.noTask" /></div>
              <Link to="/post">
                <button className="primary">
                  <FormattedMessage id="nelpcenter.myTasks.post" />
                </button>
              </Link>
            </div> :
            <div>
              {
                completedTasks.length ?
                <h2 styleName="title"><FormattedMessage id="nelpcenter.myTasks.activeTasks" /></h2> :
                null
              }
              <div styleName="tasks">{activeTasks}</div>
            </div>
          }
          {
            completedTasks.length ?
            <div>
              <h2 styleName="title"><FormattedMessage id="nelpcenter.myTasks.completedTasks" /></h2>
              <div styleName="tasks">{completedTasks}</div>
            </div> :
            null
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
              state,
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
