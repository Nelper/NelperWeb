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
        <div key={t.objectId} className={classNames(
          'task',
          {'collapsed': t !== this.state.selectedTask},
        )}>
          <div className="header" onClick={() => this._taskDetail(t)}>
            <div className="content">
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
            </div>
            <div className="collapse-icon" />
          </div>
          <div className="detail">
            <div className="desc-col">
              <div className="user-row">
                <div className="user-picture" style={{backgroundImage: `url('${t.user.pictureURL}')`}} />
                <div className="user-name">{t.user.name}</div>
              </div>
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

  _getTaskImage(task) {
    if(!task.category) {
      let categories = ['technology', 'housecleaning', 'handywork', 'gardening', 'cooking'];
      task.category = categories[Math.floor(Math.random() * 1000) % categories.length];
    }

    return require(`images/icons/category-${task.category}.png`);
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
