import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import ChangeLanguageMutation from 'actions/settings/ChangeLanguageMutation';

import {
  IconButton,
  AddLocationDialogView,
} from 'components/index';

import styles from './AccountSettingsHandler.scss';

@cssModules(styles)
class AccountSettingsHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  state = {
    showLocationDialog: false,
    email: this.props.user.privateData.email,
    phone: this.props.user.privateData.phone,
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  }

  componentWillReceiveProps(newProps) {
    // If the language has changed we need to reload the page to fetch the new messages.
    // TODO(janic): Dont reload the page :D
    if (newProps.user.privateData.language !== this.props.user.privateData.language) {
      window.location.reload();
    }
  }

  _onEmailChange(event) {
    this.setState({email: event.target.value});
  }

  _onPhoneChange(event) {
    this.setState({phone: event.target.value});
  }

  _onOldPasswordChange(event) {
    this.setState({oldPassword: event.target.value});
  }

  _onNewPasswordChange(event) {
    this.setState({newPassword: event.target.value});
  }

  _onNewPasswordConfirmChange(event) {
    this.setState({newPasswordConfirm: event.target.value});
  }

  _onOpenLocationDialog() {
    this.setState({showLocationDialog: true});
  }

  _onCloseLocationDialog() {
    this.setState({showLocationDialog: false});
  }

  _onAddLocation() {

  }

  _onChangeLanguage(event) {
    Relay.Store.update(new ChangeLanguageMutation({
      privateData: this.props.user.privateData,
      language: event.target.value,
    }));
  }

  render() {
    const {user} = this.props;

    const locations = user.privateData.locations.map(l => {
      return (
        <div styleName="location-row">
          <div styleName="name-col">{l.name}</div>
          <div styleName="address-col">
            <div>{l.streetNumber} {l.route}</div>
            <div>{l.city}, {l.province} {l.postalCode}</div>
            <div>{l.country}</div>
          </div>
          <div styleName="edit-col">
            <IconButton icon={require('images/icons/edit.svg')}/>
          </div>
        </div>
      );
    });

    return (
      <div styleName="module" className="container">
        <AddLocationDialogView
          opened={this.state.showLocationDialog}
          onLocationAdded={::this._onAddLocation}
          onCancel={::this._onCloseLocationDialog} />
        <div className="panel">
          <h2 className="panel-title">General</h2>
          <div className="panel-content">
            <div styleName="setting-row">
              <div styleName="setting-title">Email</div>
              <div styleName="setting-input">
                <input
                  type="email"
                  value={this.state.email}
                  onChange={::this._onEmailChange}
                />
              </div>
            </div>
            <div styleName="setting-row">
              <div styleName="setting-title">Phone</div>
              <div styleName="setting-input">
                <input
                  type="tel"
                  value={this.state.phone}
                  onChange={::this._onPhoneChange}
                />
              </div>
            </div>
            <div styleName="setting-row">
              <div styleName="setting-title">Language</div>
              <div styleName="setting-input">
                <select value={user.privateData.language} onChange={::this._onChangeLanguage}>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">
            <h2 styleName="add-location-title">Locations</h2>
            <button styleName="add-location-btn" className="link-button" onClick={::this._onOpenLocationDialog}>
              Add new
            </button>
          </div>
          <div className="panel-content">
            <div styleName="locations-header">
              <div styleName="name-col">
                Name
              </div>
              <div styleName="address-col">
                Address
              </div>
            </div>
            {
              locations.length ?
              locations :
              'No location yet'
            }
          </div>
        </div>
        <div className="panel">
          <h2 className="panel-title">Password</h2>
          <div className="panel-content">
            <div styleName="setting-row">
              <div styleName="setting-title">Current password</div>
              <div styleName="setting-input">
                <input
                  type="password"
                  value={this.state.oldPassword}
                  onChange={::this._onOldPasswordChange}
                />
              </div>
            </div>
            <div styleName="setting-row">
              <div styleName="setting-title">New password</div>
              <div styleName="setting-input">
                <input
                  type="password"
                  value={this.state.newPassword}
                  onChange={::this._onNewPasswordChange}
                />
              </div>
            </div>
            <div styleName="setting-row">
              <div styleName="setting-title">Confirm new password</div>
              <div styleName="setting-input">
                <input
                  type="password"
                  value={this.state.newPasswordConfirm}
                  onChange={::this._onNewPasswordConfirmChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="panel">
          <h2 className="panel-title">Delete Account</h2>
          <div className="panel-content">
            <div styleName="delete-message">Account deletion is permanent</div>
            <button className="border-btn">Delete My Account</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(AccountSettingsHandler, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        privateData {
          email,
          phone,
          language,
          locations {
            name,
            streetNumber,
            route,
            city,
            province,
            postalCode,
            country,
          },
          ${ChangeLanguageMutation.getFragment('privateData')}
        },
      }
    `,
  },
});
