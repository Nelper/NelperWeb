import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedHTMLMessage, FormattedRelative, FormattedNumber} from 'react-intl';

import {Dialog, IconButton, MapView, TaskPictureSlider} from 'components/index';
import ChatDialogView from './ChatDialogView';
import TaskProgress from './TaskProgress';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import DateUtils from 'utils/DateUtils';
import {LatLng} from 'utils/GoogleMapsUtils';
import IntlUtils from 'utils/IntlUtils';

import styles from './ApplicationDetailHandler.scss';

@cssModules(styles)
class ApplicationDetailHandler extends Component {

  static propTypes = {
    application: PropTypes.object,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  state = {
    showChatDialog: false,
    showProgressHelpDialog: false,
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

  render() {
    const {application} = this.props;

    const task = application.task;
    const hasPictures = task.pictures && task.pictures.length > 0;
    const accepted = application.state === 'ACCEPTED';

    const statusIcon = application.state === 'ACCEPTED' ?
      require('images/icons/accepted.png') :
      require('images/icons/state-pending.png');

    const statusText = application.state === 'ACCEPTED' ?
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
                <a href={'mailto:' + task.userPrivate.email}>
                  {task.userPrivate.email}
                </a>
              </div>
              {
                task.userPrivate.phone ?
                <div styleName="task-poster-contact-phone">
                  <div styleName="task-poster-contact-phone-icon" />
                  <div>
                    {IntlUtils.formatPhoneNumber(task.userPrivate.phone)}
                  </div>
                </div> :
                null
              }
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
                      <div>{task.userPrivate.exactLocation.streetNumber} {task.userPrivate.exactLocation.route}</div>
                      <div>{task.userPrivate.exactLocation.city}</div>
                      <div>{task.userPrivate.exactLocation.postalCode}</div>
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
            initialCenter={new LatLng(accepted ? task.userPrivate.exactLocation.coords : task.location)}
            markers={[{
              key: 1,
              position: new LatLng(accepted ? task.userPrivate.exactLocation.coords : task.location),
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

export default Relay.createContainer(ApplicationDetailHandler, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        createdAt,
        state,
        price,
        task {
          createdAt,
          title,
          desc,
          category,
          priceOffered,
          city,
          location {
            latitude,
            longitude,
          },
          pictures {
            url,
          },
          user {
            objectId,
            name,
            pictureURL,
          },
          userPrivate {
            phone,
            email,
            exactLocation {
              streetNumber,
              route,
              city,
              postalCode,
              coords {
                latitude,
                longitude,
              }
            },
          },
        },
      }
    `,
  },
});
