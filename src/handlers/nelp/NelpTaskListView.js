import React, {Component} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import TaskCategoryUtils from 'utils/TaskCategoryUtils';

export default class NelpTaskListView extends Component {

  state = {
    selectedTask: null,
  }

  render() {
    let {tasks} = this.props;

    let displayedTasks = tasks.map((t) => {
      return (
        <div key={t.objectId} className={classNames(
          'task',
          {'collapsed': t !== this.state.selectedTask},
        )}>
          <div className="header" onClick={() => this._taskDetail(t)}>
            <div className="content">
              <div className="user-picture" style={{backgroundImage: `url('${t.user.pictureURL}')`}}>
                <div className="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(t)}')`}} />
              </div>
              <div className="title-col">
                <div className="title">
                  {t.title}
                </div>
                <div className="user-name">By {t.user.name}</div>
                <div className="date">
                  Created {moment(t.createdAt).fromNow()}
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
                  16 km from you
                </div>
              </div>
            </div>
            <div className="collapse-icon" />
          </div>
          <div className="detail">
            <div className="desc-col">
              <div className="desc">
                {t.desc}
              </div>
            </div>
            <div className="task-image" style={{backgroundImage: `url('http://www.dlink.com/-/media/Images/Products/DSR/500N/2%20DSR500NA1Image%20LSide.png')`}} />
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
