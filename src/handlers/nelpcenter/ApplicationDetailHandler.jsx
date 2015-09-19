import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedHTMLMessage, FormattedRelative, FormattedNumber} from 'react-intl';
import connectToStores from 'alt/utils/connectToStores';

import {Progress, Dialog, IconButton, MapView, TaskPictureSlider} from 'components/index';
import ChatDialogView from './ChatDialogView';
import TaskProgress from './TaskProgress';
import ApplicationActions from 'actions/ApplicationActions';
import ApplicationStore from 'stores/ApplicationStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import DateUtils from 'utils/DateUtils';
import {LatLng} from 'utils/GoogleMapsUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

import styles from './ApplicationDetailHandler.scss';

@connectToStores
@cssModules(styles)
export default class ApplicationDetailHandler extends Component {

  static propTypes = {
    application: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
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
    showChatDialog: false,
    showProgressHelpDialog: false,
  }

  componentDidMount() {
    this._getTaskPosterInfo();
  }

  componentDidUpdate() {
    this._getTaskPosterInfo();
  }

  _onChatDialogOpen() {
    this.setState({showChatDialog: true});
  }

  _onChatDialogClose() {
    this.setState({showChatDialog: false});
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
      <div styleName="module" className="container">
        <ChatDialogView
          user={task.user}
          opened={this.state.showChatDialog}
          onClose={::this._onChatDialogClose}
        />
        <Dialog opened={this.state.showProgressHelpDialog} onClose={::this._onShowProgressHelpClose}>
          <div className="dialog-content">
            <FormattedHTMLMessage id="nelpcenter.applicationDetail.progressHelp" />
          </div>
          <div className="dialog-buttons">
            <button onClick={::this._onShowProgressHelpClose}>Close</button>
          </div>
        </Dialog>
        <div styleName="application-summary" className="panel">
          <div styleName="summary-item">
            <div styleName="summary-item-title">
              <FormattedMessage id="nelpcenter.applicationDetail.status" />
            </div>
            <div styleName="summary-item-status">
              <div styleName="summary-item-status-icon" style={{backgroundImage: `url('${statusIcon}')`}} />
              <div>{statusText}</div>
            </div>
          </div>
          <div styleName="summary-item">
            <div styleName="summary-item-title">
              {
                accepted ?
                <FormattedMessage id="nelpcenter.applicationDetail.agreed" /> :
                <FormattedMessage id="nelpcenter.applicationDetail.offer" />
              }
            </div>
            <div styleName="summary-item-price">
              <FormattedNumber value={application.price} format="priceTag" />
            </div>
          </div>
          <div styleName="summary-item">
            <div styleName="summary-item-title">
              {accepted ? <FormattedMessage id="common.accepted" /> : <FormattedMessage id="common.applied" />}
            </div>
            <div styleName="summary-item-applied">
              <div styleName="summary-item-applied-icon" />
              <div>
                {
                  accepted ?
                  <FormattedRelative value={application.acceptedAt || new Date()} /> :
                  <FormattedRelative value={application.createdAt} />
                }
              </div>
            </div>
          </div>
        </div>
        {
          accepted ?
          <div styleName="task-progress" className="panel">
            <IconButton
              styleName="task-progress-help"
              icon={require('images/icons/help.svg')}
              onClick={::this._onShowProgressHelp}
            />
            <TaskProgress step={1} steps={[
              {title: <FormattedMessage id="nelpcenter.applicationDetail.progressAccepted" />},
              {title: <FormattedMessage id="nelpcenter.applicationDetail.progressSent" />},
              {title: <FormattedMessage id="nelpcenter.applicationDetail.progressPayment" />},
              {title: <FormattedMessage id="nelpcenter.applicationDetail.progressReleased" />},
            ]} />
            <div styleName="task-progress-btn-container">
              <button styleName="task-progress-completed-btn" className="primary">
                <FormattedMessage id="nelpcenter.applicationDetail.completed" />
              </button>
            </div>
          </div> :
          null
        }
        <div styleName="task-poster-section" className="panel">
          <div styleName="task-poster-profile-row">
            <div styleName="task-poster-profile">
              <div
                styleName="task-poster-picture"
                style={{backgroundImage: `url('${task.user.pictureURL}')`}}
              >
                <div styleName="task-poster-picture-overlay">
                  <div styleName="task-poster-picture-icon" />
                  <div styleName="task-poster-picture-text">
                    <FormattedMessage id="common.viewProfile" />
                  </div>
                </div>
              </div>
              <div styleName="task-poster-name">{task.user.name}</div>
            </div>
            <div styleName="task-poster-chat">
              <div styleName="task-poster-chat-icon" />
              <button styleName="task-poster-chat-btn" className="border-btn primary" onClick={::this._onChatDialogOpen}>
                <FormattedMessage id="nelpcenter.applicationDetail.chat" />
              </button>
            </div>
          </div>
          {
            accepted ?
            <div styleName="task-poster-contact">
              <div styleName="task-poster-contact-email">
                <div styleName="task-poster-contact-email-icon" />
                <div>
                  {task.email}
                </div>
              </div>
              <div styleName="task-poster-contact-phone">
                <div styleName="task-poster-contact-phone-icon" />
                <div>
                  {task.phone}
                </div>
              </div>
            </div> :
            null
          }
        </div>
        <div styleName="task-info-section" className="panel">
          <div styleName="task-info-title-row">
            <div
              styleName="task-info-category-icon"
              style={{backgroundImage: `url(${TaskCategoryUtils.getImage(task.category)})`}}
            />
            <div styleName="task-info-title">{task.title}</div>
          </div>
          <div styleName="task-info-other-row">
            <div styleName={hasPictures ? 'main-col-has-pictures' : 'main-col'}>
              <div styleName="task-info-desc">
                {task.desc}
              </div>
              {
                accepted ?
                <div>
                  <div styleName="task-info-exact-location">
                    <div styleName="task-info-exact-location-icon" />
                    <div>
                      {task.exactLocation && task.exactLocation.address.replace(',', '\n').replace(',', '\n')}
                    </div>
                  </div>
                </div> :
                <div>
                  <div styleName="task-info-calendar-row">
                    <div styleName="task-info-calendar">
                      <div styleName="task-info-calendar-icon" />
                      <div styleName="task-info-calendar-text">
                        <div>
                          <FormattedMessage id="common.postedRelative" values={{
                            formattedAgo: <FormattedRelative value={task.createdAt} />,
                          }}/>
                        </div>
                        <div>
                          <FormattedMessage id="common.expiresRelative" values={{
                            formattedAgo: <FormattedRelative value={DateUtils.addDays(task.createdAt, 15)} />,
                          }}/>
                        </div>
                      </div>
                    </div>
                    <div styleName="task-info-location">
                      <div styleName="task-info-location-icon" />
                      <div>{task.city}</div>
                    </div>
                  </div>
                  <div styleName="task-info-price-row">
                    <div styleName="task-info-price-text">
                      <FormattedMessage id="nelpcenter.applicationDetail.offering" />
                    </div>
                    <div styleName="task-info-price">
                      <FormattedNumber value={task.priceOffered} format="priceTag" />
                    </div>
                  </div>
                </div>
              }
            </div>
              {
                hasPictures ?
                <div styleName="task-info-image-col">
                  <TaskPictureSlider task={task} />
                </div> :
                null
              }
          </div>
          <div styleName="map-message">
            {
              accepted ?
              <FormattedMessage id="nelpcenter.applicationDetail.locationShown" /> :
              <FormattedMessage id="nelpcenter.applicationDetail.locationWithin" />
            }
          </div>
        </div>
        <div styleName="task-info-map" className="panel">
          <MapView
            initialCenter={new LatLng(task.location)}
            markers={[{
              key: 1,
              position: new LatLng(task.location),
            }]}/>
        </div>
        {
          !accepted ?
          <div styleName="cancel-button-container">
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
