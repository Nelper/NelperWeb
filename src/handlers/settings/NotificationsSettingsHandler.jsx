import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import {Checkbox} from 'components/index';
import {UpdateNotificationSettingsMutation} from 'actions/settings/index';

import styles from './NotificationsSettingsHandler.scss';

@cssModules(styles)
class NotificationsSettingsHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  _onUpdateNotificationSetting(settingId, value) {
    Relay.Store.update(new UpdateNotificationSettingsMutation({
      privateData: this.props.user.privateData,
      settingId,
      settingValue: {
        email: value,
      },
    }));
  }

  render() {
    const {user} = this.props;
    const {notifications} = user.privateData;

    return (
      <div styleName="module">
        <div className="panel">
          <h2 className="panel-title">Email notifications</h2>
          <div className="panel-content">
            <div styleName="setting-row">
              <div styleName="title-col">Task Poster</div>
              <div styleName="input-col">
                <div styleName="title">Email me when</div>
                <div styleName="input">
                  <Checkbox
                    selected={notifications.posterApplication.email}
                    title="A Nelper applies for my task"
                    onCheck={(value) => this._onUpdateNotificationSetting('posterApplication', value)}
                  />
                </div>
                <div styleName="input">
                  <Checkbox
                    selected={notifications.posterRequestPayment.email}
                    title="My Nelper requests their payment"
                    onCheck={(value) => this._onUpdateNotificationSetting('posterRequestPayment', value)}
                  />
                </div>
              </div>
            </div>
            <div styleName="setting-row">
              <div styleName="title-col">Nelper</div>
              <div styleName="input-col">
                <div styleName="title">Email me when</div>
                <div styleName="input">
                  <Checkbox
                    selected={notifications.nelperApplicationStatus.email}
                    title="My task application status changed"
                    onCheck={(value) => this._onUpdateNotificationSetting('nelperApplicationStatus', value)}
                  />
                </div>
                <div styleName="input">
                  <Checkbox
                    selected={notifications.nelperReceivedPayment.email}
                    title="I receive a payment"
                    onCheck={(value) => this._onUpdateNotificationSetting('nelperReceivedPayment', value)}
                  />
                </div>
              </div>
            </div>
            <div styleName="setting-row">
              <div styleName="title-col">Newsletter</div>
              <div styleName="input-col">
                <div styleName="title">Send me</div>
                <div styleName="input">
                  <Checkbox
                    selected={notifications.newsletter.email}
                    title="Our newsletter introducing new features"
                    onCheck={(value) => this._onUpdateNotificationSetting('newsletter', value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(NotificationsSettingsHandler, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        privateData {
          notifications {
            posterApplication {
              email,
            },
            posterRequestPayment {
              email,
            },
            nelperApplicationStatus {
              email,
            },
            nelperReceivedPayment {
              email,
            },
            newsletter {
              email,
            },
          }
          ${UpdateNotificationSettingsMutation.getFragment('privateData')}
        }
      }
    `,
  },
});
