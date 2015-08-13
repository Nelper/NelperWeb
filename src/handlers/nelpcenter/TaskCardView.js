import React, {Component, PropTypes} from 'react';

import {Card, CardImageHeader, CardContent} from 'components/Card';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

export default class TaskCardView extends Component {

  static propTypes = {
    task: PropTypes.object,
    onClick: PropTypes.func,
  }

  render() {
    let {task, onClick} = this.props;
    return (
      <Card
        className="task-card-view"
        onClick={onClick}>
        <CardImageHeader style={this._taskImageStyles(task)}>
          <div className="category">
            <div className="icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
            <div className="name">
              {TaskCategoryUtils.getName(task.category)}
            </div>
          </div>
        </CardImageHeader>
        <CardContent>
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
        </CardContent>
      </Card>
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

  _taskImageStyles(t) {
    let hasImage = t.pictures && t.pictures.length > 0;
    let url = hasImage ? t.pictures[0].url : require('images/image-placeholder.png');
    return {
      backgroundSize: hasImage ? 'cover' : 46,
      backgroundImage: `url('${url}')`,
    };
  }
}
