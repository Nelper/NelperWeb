import React, {Component, PropTypes} from 'react';

import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

export default class FindNelpCardView extends Component {

  static propTypes = {
    task: PropTypes.object,
    onClick: PropTypes.func,
  }

  render() {
    let {task, onClick} = this.props;
    return (
      <div
        className="find-nelp-card-view"
        style={{backgroundColor: TaskCategoryUtils.getLightColor(task.category)}}
        onClick={onClick}>
        <div className="card-image" style={{backgroundImage: `url('${this._taskImage(task)}')`}}>
          <div className="image-overlay" />
          <div className="category">
            <div className="icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
            <div className="name">
              {TaskCategoryUtils.getName(task.category)}
            </div>
          </div>
        </div>
        <div className="card-content">
          <div className="title">
            {task.title}
          </div>
          <div className="applicants-row">
            {this._renderStatus()}
            {this._renderApplicants()}
            <div className="price">
              {'$' + task.priceOffered}
            </div>
          </div>
          <div className="desc">
            {task.desc}
          </div>
        </div>
        <div className="card-hover"/>
      </div>
    );
  }

  _renderStatus() {
    let icon;
    if(this._hasAcceptedApplications()) {
      icon = require('images/icons/state-accepted.png');
    } else if(this.props.task.isNew) {
      icon = require('images/icons/state-new.png');
    } else {
      icon = require('images/icons/state-pending.png');
    }

    return (
      <div className="status-icon" style={{backgroundImage: `url('${icon}')`}} />
    );
  }

  _renderApplicants() {
    let pendingApplications = this.props.task.applications.filter(a => a.state === NELP_TASK_APPLICATION_STATE.PENDING);
    return (
      <div className="applicants">
      {
        !this._hasAcceptedApplications() ?
        (pendingApplications.length + (pendingApplications.length > 1 ? ' applicants' : ' applicant')) :
        'Accepted'
      }
      </div>
    );
  }

  _hasAcceptedApplications() {
    return this.props.task.applications.some(a => a.state === NELP_TASK_APPLICATION_STATE.ACCEPTED);
  }

  _taskImage(t) {
    if(!t.pictures || t.pictures.length === 0) {
      return require('images/task-no-picture.png');
    }
    return t.pictures[0].url;
  }
}
