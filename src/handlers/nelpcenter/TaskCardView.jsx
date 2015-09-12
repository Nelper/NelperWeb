import React, {Component, PropTypes} from 'react';
import {FormattedMessage, FormattedRelative} from 'react-intl';
import DateUtils from 'utils/DateUtils';

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
      backgroundImage: hasImage ?
        `url('${t.pictures[0].url}')` :
        `url('${TaskCategoryUtils.getImage(t.category)}')`,
    };
  }

  _hasAcceptedApplications() {
    return this.props.task.applications.some(a => a.state === NELP_TASK_APPLICATION_STATE.ACCEPTED);
  }

  _renderStatus() {
    let icon;
    if (this._hasAcceptedApplications()) {
      icon = require('images/icons/accepted.png');
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
        <FormattedMessage id="nelpcenter.common.nelperCount" values={{
          num: pendingApplications.length,
        }}/> :
        <FormattedMessage id="common.accepted"/>
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
            <div>
              <FormattedMessage id="common.postedRelative" values={{
                formattedAgo: <FormattedRelative value={task.createdAt} />,
              }}/>
            </div>
            <div className="calendar-icon" />
            <div>
              <FormattedMessage id="common.expiresRelative" values={{
                formattedAgo: <FormattedRelative value={DateUtils.addDays(task.createdAt, 15)} />,
              }}/>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
