import React, {Component} from 'react';
import classNames from 'classnames';
import moment from 'moment';

export default class NelpTaskListView extends Component {

  state = {
    selectedTask: null,
  }

  render() {
    let {tasks} = this.props;

    let displayedTasks = tasks.map((t) => {
      return (
        <div key={t.objectId}
        className="task">
          <div className="header" onClick={() => this._taskDetail(t)}>
            <div className="category-icon" style={{backgroundImage: `url('${this._getTaskImage(t)}')`}} />
            <div className="title-col">
              <div className="title">
                {t.title}
              </div>
              <div className="date">
                {moment(t.createdAt).format('MMMM Do YYYY')}
              </div>
            </div>
            <div className="price">
              {t.priceOffered || 'N/A'}
            </div>
            <div className="location-col">
              <div className="city">
                Montreal
              </div>
              <div className="distance">
                16 km from me
              </div>
            </div>
            <div className={classNames('collapse-icon', {'collapsed': t !== this.state.selectedTask})} />
          </div>
          <div className={classNames(
            'detail',
            {'collapsed': t !== this.state.selectedTask},
          )}>
            <div className="desc">
              {t.desc}
            </div>

          </div>
        </div>
      );
    });

    return (
      <div className="nelp-task-list-view">
        {displayedTasks}
      </div>
    );
  }

  _getTaskImage(task) {
    if(task.category) {
      return require(`images/icons/category-${task.category}.png`);
    }
    let categories = ['technology', 'housecleaning', 'handywork', 'gardening', 'cooking'];
    let index = Math.floor(Math.random() * 1000) % categories.length;
    return require(`images/icons/category-${categories[index]}.png`);
  }

  _taskDetail(task) {
    // If we click the current task we close it else we
    // select it.
    if(task === this.state.selectedTask) {
      this.setState({selectedTask: null});
    } else {
      this.setState({selectedTask: task});
    }

    if(this.props.onTaskSelected) {
      this.props.onTaskSelected.call(null, task);
    }
  }
}
