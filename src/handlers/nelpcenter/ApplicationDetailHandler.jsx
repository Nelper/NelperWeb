import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import moment from 'moment';
import classNames from 'classnames';

import Progress from 'components/Progress';
import MapView from 'components/MapView';
import IconButton from 'components/IconButton';
import TaskPictureSlider from 'components/TaskPictureSlider';
import ApplicationActions from 'actions/ApplicationActions';
import ApplicationStore from 'stores/ApplicationStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import {LatLng} from 'utils/GoogleMapsUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

@connectToStores
export default class ApplicationDetailHandler extends Component {

  static propTypes = {
    application: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [ApplicationStore];
  }

  static getPropsFromStores(props) {
    const applications = ApplicationStore.getState().applications;
    const application = applications.find(a => a.objectId === props.params.id);
    if (!application) {
      if (__CLIENT__) {
        ApplicationActions.refreshMyApplications();
      }

      return {
        application: null,
        isLoading: true,
      };
    }

    return {
      application,
      isLoading: false,
    };
  }

  componentDidMount() {

  }

  componentWillUpdate() {

  }

  _getTaskPosterInfo() {
    if (!__CLIENT__) {
      return;
    }
    const application = this.props.application;
    if (application && !application.hasTaskPosterInfo) {
      ApplicationActions.requestTaskPosterInfo(application);
    }
  }

  _renderProgressBar() {
    const acceptedState = 1;
    const pendingState = acceptedState + 1;
    return (
      <div className="progress-bar-container">
        <div className="title-task-completion">Task Completion</div>
        <div className="progress-bar">
          <div className="progress-bar-node completed">
            <span>1</span>
            <div className="progress-bar-title completed">Accepted</div>
          </div>
          <div className={classNames(
            'progress-bar-edge',
            {'pending': pendingState === 1},
            {'completed': acceptedState >= 1},
          )} />
          <div className={classNames('progress-bar-node', {'completed': acceptedState >= 1})}>
            <span>2</span>
            <div className={classNames('progress-bar-title', {'completed': acceptedState >= 1})}>
              Payment sent
            </div>
          </div>
          <div className={classNames(
            'progress-bar-edge',
            'long-edge',
            {'pending': pendingState === 2},
            {'completed': acceptedState >= 2},
          )} />
          <div className={classNames('progress-bar-node', {'completed': acceptedState >= 2})}>
            <span>3</span>
            <div className={classNames('progress-bar-title', {'completed': acceptedState >= 2})}>
              Payment requested
            </div>
          </div>
          <div className={classNames(
            'progress-bar-edge',
            {'pending': pendingState === 3},
            {'completed': acceptedState >= 3},
          )} />
          <div className={classNames('progress-bar-node', {'completed': acceptedState >= 3})}>
            <span>4</span>
            <div className={classNames('progress-bar-title', {'completed': acceptedState >= 3})}>
              Funds released
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {application, isLoading} = this.props;
    if (isLoading) {
      return (
        <div className="progress-center">
          <Progress />
        </div>
      );
    }

    const task = application.task;
    const hasPictures = task.pictures && task.pictures.length > 0;
    const accepted = application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED;

    const statusIcon = application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED ?
      require('images/icons/state-accepted.png') :
      require('images/icons/state-pending.png');

    const statusText = application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED ?
      'Accepted' :
      'Pending';

    return (
      <div className="application-detail-handler container">
        <div className="panel application-summary">
          <div className="summary-item">
            <div className="summary-item-title">Application status</div>
            <div className="summary-item-status">
              <div className="summary-item-status-icon" style={{backgroundImage: `url('${statusIcon}')`}} />
              <div className="summary-item-status-text">{statusText}</div>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-item-title">{accepted ? 'Agreed Price' : 'Your offer'}</div>
            <div className="summary-item-price">${application.price}</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-title">{accepted ? 'Accepted' : 'Applied'}</div>
            <div className="summary-item-applied">
              <div className="summary-item-applied-icon" />
              <div className="summary-item-applied-text">
                {
                  accepted ?
                  moment(application.acceptedAt).fromNow() :
                  moment(application.createdAt).fromNow()
                }
              </div>
            </div>
          </div>
        </div>
        {
          accepted ?
          <div className="panel task-progress">
            <IconButton />
            {this._renderProgressBar()}
            <div className="task-progress-btn-container">
              <button className="primary">I have completed the task!</button>
            </div>
          </div> :
          null
        }
        <div className="panel task-poster-section">
          <div className="task-poster-profile-row">
            <div className="task-poster-profile">
              <div
                className="task-poster-picture"
                style={{backgroundImage: `url('${task.user.pictureURL}')`}}
              >
                <div className="task-poster-picture-overlay">
                  <div className="task-poster-picture-icon" />
                  <div className="task-poster-picture-text">View Profile</div>
                </div>
              </div>
              <div className="task-poster-name">{task.user.name}</div>
            </div>
            <div className="task-poster-chat">
              <div className="task-poster-chat-icon" />
              <button className="border-btn">Chat with the Task Poster</button>
            </div>
          </div>
          {
            accepted ?
            <div className="task-poster-contact">
              <div className="task-poster-contact-email">
                <div className="task-poster-contact-email-icon" />
                <div className="task-poster-contact-email-text">
                  {task.user.email}
                </div>
              </div>
              <div className="task-poster-contact-phone">
                <div className="task-poster-contact-phone-icon" />
                <div className="task-poster-contact-phone-text">
                  {task.user.phone}
                </div>
              </div>
            </div> :
            null
          }
        </div>
        <div className="panel task-info-section">
          <div className="task-info-title-row">
            <div
              className="task-info-category-icon"
              style={{backgroundImage: `url(${TaskCategoryUtils.getImage(task.category)})`}}
            />
            <div className="task-info-title">{task.title}</div>
          </div>
          <div className="task-info-other-row">
            <div className={classNames('task-info-main-col', {'has-pictures': hasPictures})}>
              <div className="task-info-desc">
                {task.desc}
              </div>
              {
                accepted ?
                null :
                <div>
                  <div className="task-info-calendar-row">
                    <div className="task-info-calendar">
                      <div className="task-info-calendar-icon" />
                      <div className="task-info-calendar-text">
                        <div className="task-info-calendar-posted">
                          Posted {moment(task.createdAt).fromNow()}
                        </div>
                        <div className="task-info-calendar-expires">
                          Expires {moment(task.createdAt).add(15, 'day').fromNow()}
                        </div>
                      </div>
                    </div>
                    <div className="task-info-location">
                      <div className="task-info-location-icon" />
                      <div className="task-info-location-text">{task.city}</div>
                    </div>
                  </div>
                  <div className="task-info-price-row">
                    <div className="task-info-price-text">Task Poster is offering</div>
                    <div className="task-info-price">${task.priceOffered}</div>
                  </div>
                </div>
              }
            </div>
              {
                hasPictures ?
                <div className="task-info-image-col">
                  <div className="task-info-pictures">
                    <TaskPictureSlider task={task} />
                  </div>
                </div> :
                null
              }
          </div>
          <div className="map-message">Task location within 400m</div>
        </div>
        <div className="task-info-map panel">
          <MapView
            initialCenter={new LatLng(task.location)}
            markers={[{
              k: 1,
              position: new LatLng(task.location),
            }]}/>
        </div>
        {
          !accepted ?
          <div className="cancel-button-container">
            <button className="white-button">Cancel Application</button>
          </div> :
          null
        }
      </div>
    );
  }
}
