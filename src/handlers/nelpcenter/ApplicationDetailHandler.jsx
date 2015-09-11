import React, {Component, PropTypes} from 'react';
import {FormattedMessage, FormattedHTMLMessage, FormattedRelative, FormattedNumber} from 'react-intl';
import connectToStores from 'alt/utils/connectToStores';
import classNames from 'classnames';

import Progress from 'components/Progress';
import MapView from 'components/MapView';
import IconButton from 'components/IconButton';
import Dialog from 'components/Dialog';
import TaskPictureSlider from 'components/TaskPictureSlider';
import TaskProgress from './TaskProgress';
import ApplicationActions from 'actions/ApplicationActions';
import ChatActions from 'actions/ChatActions';
import ApplicationStore from 'stores/ApplicationStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import DateUtils from 'utils/DateUtils';
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

  state = {
    showProgressHelpDialog: false,
  }

  componentDidMount() {
    this._getTaskPosterInfo();
    ChatActions.init();
  }

  componentDidUpdate() {
    this._getTaskPosterInfo();
  }

  _onShowProgressHelp() {
    this.setState({showProgressHelpDialog: true});
  }

  _onShowProgressHelpClose() {
    this.setState({showProgressHelpDialog: false});
  }

  _getTaskPosterInfo() {
    if (!__CLIENT__) {
      return;
    }
    const application = this.props.application;
    if (application && !application.hasTaskPosterInfo && application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED) {
      ApplicationActions.requestTaskPosterInfo(application);
    }
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
      require('images/icons/accepted.png') :
      require('images/icons/state-pending.png');

    const statusText = application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED ?
      <FormattedMessage id="common.accepted" /> :
      <FormattedMessage id="common.pending" />;

    return (
      <div className="application-detail-handler container">
        <Dialog opened={this.state.showProgressHelpDialog} onClose={::this._onShowProgressHelpClose}>
          <div className="dialog-content">
            <FormattedHTMLMessage id="nelpcenter.applicationDetail.progressHelp" />
          </div>
          <div className="dialog-buttons">
            <button onClick={::this._onShowProgressHelpClose}>Close</button>
          </div>
        </Dialog>
        <div className="panel application-summary">
          <div className="summary-item">
            <div className="summary-item-title">
              <FormattedMessage id="nelpcenter.applicationDetail.status" />
            </div>
            <div className="summary-item-status">
              <div className="summary-item-status-icon" style={{backgroundImage: `url('${statusIcon}')`}} />
              <div className="summary-item-status-text">{statusText}</div>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-item-title">
              {
                accepted ?
                <FormattedMessage id="nelpcenter.applicationDetail.agreed" /> :
                <FormattedMessage id="nelpcenter.applicationDetail.offer" />
              }
            </div>
            <div className="summary-item-price">
              <FormattedNumber value={application.price} format="priceTag" />
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-item-title">
              {accepted ? <FormattedMessage id="common.accepted" /> : <FormattedMessage id="common.applied" />}
            </div>
            <div className="summary-item-applied">
              <div className="summary-item-applied-icon" />
              <div className="summary-item-applied-text">
                {
                  accepted ?
                  <FormattedRelative value={application.acceptedAt} /> :
                  <FormattedRelative value={application.createdAt} />
                }
              </div>
            </div>
          </div>
        </div>
        {
          accepted ?
          <div className="panel task-progress">
            <IconButton
              className="task-progress-help"
              icon={require('images/icons/help.svg')}
              onClick={::this._onShowProgressHelp}
            />
            <TaskProgress step={1} steps={[
              {title: <FormattedMessage id="nelpcenter.applicationDetail.progressAccepted" />},
              {title: <FormattedMessage id="nelpcenter.applicationDetail.progressSent" />},
              {title: <FormattedMessage id="nelpcenter.applicationDetail.progressPayment" />},
              {title: <FormattedMessage id="nelpcenter.applicationDetail.progressReleased" />},
            ]} />
            <div className="task-progress-btn-container">
              <button className="primary task-progress-completed-btn">
                <FormattedMessage id="nelpcenter.applicationDetail.completed" />
              </button>
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
                  <div className="task-poster-picture-text">
                    <FormattedMessage id="common.viewProfile" />
                  </div>
                </div>
              </div>
              <div className="task-poster-name">{task.user.name}</div>
            </div>
            <div className="task-poster-chat">
              <div className="task-poster-chat-icon" />
              <button className="border-btn task-poster-chat-btn">
                <FormattedMessage id="nelpcenter.applicationDetail.chat" />
              </button>
            </div>
          </div>
          {
            accepted ?
            <div className="task-poster-contact">
              <div className="task-poster-contact-email">
                <div className="task-poster-contact-email-icon" />
                <div className="task-poster-contact-email-text">
                  {task.email}
                </div>
              </div>
              <div className="task-poster-contact-phone">
                <div className="task-poster-contact-phone-icon" />
                <div className="task-poster-contact-phone-text">
                  {task.phone}
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
                <div>
                  <div className="task-info-exact-location">
                    <div className="task-info-exact-location-icon" />
                    <div className="task-info-exact-location-text">
                      {task.exactLocation && task.exactLocation.address.replace(',', '\n').replace(',', '\n')}
                    </div>
                  </div>
                </div> :
                <div>
                  <div className="task-info-calendar-row">
                    <div className="task-info-calendar">
                      <div className="task-info-calendar-icon" />
                      <div className="task-info-calendar-text">
                        <div className="task-info-calendar-posted">
                          <FormattedMessage id="common.postedRelative" values={{
                            formattedAgo: <FormattedRelative value={task.createdAt} />,
                          }}/>
                        </div>
                        <div className="task-info-calendar-expires">
                          <FormattedMessage id="common.expiresRelative" values={{
                            formattedAgo: <FormattedRelative value={DateUtils.addDays(task.createdAt, 15)} />,
                          }}/>
                        </div>
                      </div>
                    </div>
                    <div className="task-info-location">
                      <div className="task-info-location-icon" />
                      <div className="task-info-location-text">{task.city}</div>
                    </div>
                  </div>
                  <div className="task-info-price-row">
                    <div className="task-info-price-text">
                      <FormattedMessage id="nelpcenter.applicationDetail.offering" />
                    </div>
                    <div className="task-info-price">
                      <FormattedNumber value={task.priceOffered} format="priceTag" />
                    </div>
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
          <div className="map-message">
            {
              accepted ?
              <FormattedMessage id="nelpcenter.applicationDetail.locationShown" /> :
              <FormattedMessage id="nelpcenter.applicationDetail.locationWithin" />
            }
          </div>
        </div>
        <div className="task-info-map panel">
          <MapView
            initialCenter={new LatLng(task.location)}
            markers={[{
              key: 1,
              position: new LatLng(task.location),
            }]}/>
        </div>
        {
          !accepted ?
          <div className="cancel-button-container">
            <button className="white-button">
              <FormattedMessage id="common.cancelApply" />
            </button>
          </div> :
          null
        }
      </div>
    );
  }
}
