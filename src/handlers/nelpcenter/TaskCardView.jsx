import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import {Card, CardImageHeader, CardContent} from 'components/Card';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

export default class TaskCardView extends Component {

  static propTypes = {
    task: PropTypes.object,
    onClick: PropTypes.func,
  }

  _getTaskImageStyles(t) {
    const hasImage = t.pictures && t.pictures.length > 0;
    return {
      backgroundImage: hasImage ? `url('${t.pictures[0].url}')` : null,
    };
  }

  _hasAcceptedApplications() {
    return this.props.task.applications.some(a => a.state === NELP_TASK_APPLICATION_STATE.ACCEPTED);
  }

  _renderStatus() {
    let icon;
    if (this._hasAcceptedApplications()) {
      icon = require('images/icons/state-accepted.png');
    } else {
      icon = require('images/icons/applicants.png');
    }

    return (
      <div className="status-icon" style={{backgroundImage: `url('${icon}')`}} />
    );
  }

  _renderApplicants() {
    const pendingApplications = this.props.task.applications.filter(a => a.state === NELP_TASK_APPLICATION_STATE.PENDING);
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

  render() {
    const {task, onClick} = this.props;
    return (
      <Card
        className="task-card-view"
        onClick={onClick}>
        <CardImageHeader  className="header">
          <div className="image-overlay" style={this._getTaskImageStyles(task)} />
          <div className="category">
            {
              task.isNew ?
              <div className="is-new">
                <div className="is-new-icon" />
              </div> :
              null
            }
            <div className="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
          </div>
        </CardImageHeader>
        <CardContent className="content">
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
          <div className="calendar-row">
            <div>Posted {moment(task.createdAt).fromNow()}</div>
            <div className="calendar-icon" />
            <div>Expires {moment(task.createdAt).add(14, 'day').fromNow()}</div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
