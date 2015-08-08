import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import UserStore from 'stores/UserStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import LocationUtils from 'utils/LocationUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

export default class NelpTaskListView extends Component {

  static propTypes = {
    onTaskSelected: PropTypes.func,
    onApply: PropTypes.func,
    onCancelApply: PropTypes.func,
  }

  state = {
    selectedTask: null,
  }

  render() {
    let {tasks} = this.props;

    let displayedTasks = tasks.map((t) => {

      let distance = Math.round(LocationUtils.kilometersBetween(t.location, UserStore.state.user.location));

      return (
        <div key={t.objectId} className={classNames(
          'task',
          {'collapsed': t !== this.state.selectedTask},
        )}>
          <div className="header" onClick={() => this._taskDetail(t)}>
            <div className="content">
              <div className="user-picture" style={{backgroundImage: `url('${t.user.pictureURL}')`}}>
                <div className="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(t.category)}')`}} />
              </div>
              <div className="title-col">
                <div className="title">
                  {t.title}
                </div>
                <div className="infos">
                  <div className="user-col">
                    <div className="user-name">By {t.user.name}</div>
                    <div className="date">
                      Created {moment(t.createdAt).fromNow()}
                    </div>
                  </div>
                  <div className="location-col">
                    <div className="city">
                      {t.city || 'N/A'}
                    </div>
                    <div className="distance">
                      {distance} km away from you
                    </div>
                  </div>
                  <div className="price">
                    {'$' + t.priceOffered}
                  </div>
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
              <div className="btn-group controls">
                {
                  t.application && t.application.state === NELP_TASK_APPLICATION_STATE.PENDING ?
                  <button className="primary" onClick={() => this._cancelApplication(t)}>
                    Cancel application
                  </button> :
                  <button className="primary" onClick={() => this._apply(t)}>
                    Apply!
                  </button>
                }
                <button className="blue">Make an offer</button>
              </div>
            </div>
            {
              t.pictures && t.pictures.length > 0 ?
              <div className="task-image" style={{backgroundImage: `url('${t.pictures[0].url}')`}} /> :
              null
            }
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

  _apply(task) {
    if(this.props.onApply) {
      this.props.onApply.call(null, task);
    }
  }

  _cancelApplication(task) {
    if(this.props.onCancelApply) {
      this.props.onCancelApply.call(null, task);
    }
  }
}
