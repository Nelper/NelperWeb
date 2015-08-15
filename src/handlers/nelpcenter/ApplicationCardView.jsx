import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import {Card, CardImageHeader, CardContent} from 'components/Card';
import UserStore from 'stores/UserStore';
import LocationUtils from 'utils/LocationUtils';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

export default class TaskCardView extends Component {

  static propTypes = {
    application: PropTypes.object,
    onClick: PropTypes.func,
  }

  render() {
    let {application, onClick} = this.props;
    let task = application.task;

    let distance = Math.round(LocationUtils.kilometersBetween(task.location, UserStore.state.user.location));
    let statusIcon = application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED ?
      require('images/icons/state-accepted.png') :
      require('images/icons/state-pending.png');

    let statusText = application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED ?
      'Accepted' :
      'Pending';

    return (
      <Card
        className="application-card-view"
        onClick={onClick}>
        <CardImageHeader>
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
        <CardContent>
          <div className="title">
            {task.title}
          </div>
          <div className="info-row status">
            <div className="status-icon" style={{backgroundImage: `url('${statusIcon}')`}} />
            <div className="text">{statusText}</div>
            <div className="price">
              {'$' + task.priceOffered}
            </div>
          </div>
          <div className="info-row calendar">
            <div className="calendar-icon" />
            <div className="text">Applied {moment(application.createdAt).fromNow()}</div>
          </div>
          <div className="info-row location">
            <div className="location-icon" />
            <div className="text">
              <div className="city">{task.city}</div>
              <div className="distance">{distance} km away from you</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
