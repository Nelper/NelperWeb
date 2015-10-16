import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import {SaveGeneralSettingsMutation, ChangePasswordMutation} from 'actions/settings/index';
import Storage from 'utils/Storage';

import {
  IconButton,
  ProgressButton,
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
    language: this.props.user.privateData.language,
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  }

  _onEmailChange(event) {
    this.setState({email: event.target.value});
  }

  _onPhoneChange(event) {
    this.setState({phone: event.target.value});
  }

  _oncurrentPasswordChange(event) {
    this.setState({currentPassword: event.target.value});
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
    this.setState({language: event.target.value});
  }

  _onSaveGeneralClick() {
    const needReload = this.props.user.privateData.language !== this.state.language;
    this.setState({savingGeneral: true});
    Relay.Store.update(new SaveGeneralSettingsMutation({
      privateData: this.props.user.privateData,
      email: this.state.email,
      phone: this.state.phone,
      language: this.state.language,
    }), {
      onSuccess: () => {
        if (needReload) {
          window.location.reload();
        }
        this.setState({savingGeneral: false});
      },
      onFailure: () => {
        this.setState({savingGeneral: false});
      },
    });
    Storage.setItem('lang', this.state.language);
  }

  _onChangePasswordClick() {
    Relay.Store.update(new ChangePasswordMutation({
      currentPassword: this.state.currentPassword,
      newPassword: this.state.newPassword,
    }), {
      onSuccess: (data) => {
        console.log(data);
      },
      onFailure: (transaction) => {
        console.log(transaction.getError());
      },
    });
  }

  _getCanSaveGeneral() {
    const {privateData} = this.props.user;
    return this.state.email !== privateData.email ||
      this.state.phone !== privateData.phone ||
      this.state.language !== privateData.language;
  }

  _getCanSavePassword() {
    return this.state.currentPassword.length &&
      this.state.newPassword.length &&
      this.state.newPassword === this.state.newPasswordConfirm;
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
          <h2 className="panel-title">
            <FormattedMessage id="settings.account.general" />
          </h2>
          <div className="panel-content">
            <div styleName="setting-row">
              <div styleName="setting-title">
                <FormattedMessage id="settings.account.email" />
              </div>
              <div styleName="setting-input">
                <input
                  type="email"
                  value={this.state.email}
                  onChange={::this._onEmailChange}
                />
              </div>
            </div>
            <div styleName="setting-row">
              <div styleName="setting-title">
                <FormattedMessage id="settings.account.phone" /
                  ></div>
              <div styleName="setting-input">
                <input
                  type="tel"
                  value={this.state.phone}
                  onChange={::this._onPhoneChange}
                />
              </div>
            </div>
            <div styleName="setting-row">
              <div styleName="setting-title">
                <FormattedMessage id="settings.account.language" />
              </div>
              <div styleName="setting-input">
                <select value={this.state.language} onChange={::this._onChangeLanguage}>
                  <FormattedMessage id="settings.account.english">
                    {(message) => <option value="en">{message}</option>}
                  </FormattedMessage>
                  <FormattedMessage id="settings.account.french">
                    {(message) => <option value="fr">{message}</option>}
                  </FormattedMessage>
                </select>
              </div>
            </div>
            <ProgressButton
              className="primary"
              disabled={!this._getCanSaveGeneral()}
              loading={this.state.savingGeneral}
              onClick={::this._onSaveGeneralClick}
            >
              Save changes
            </ProgressButton>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">
            <h2><FormattedMessage id="settings.account.locations" /></h2>
            <button className="link-button" onClick={::this._onOpenLocationDialog}>
              <FormattedMessage id="settings.account.locationAdd" />
            </button>
          </div>
          <div className="panel-content">
            <div styleName="locations-header">
              <div styleName="name-col">
                <FormattedMessage id="settings.account.locationName" />
              </div>
              <div styleName="address-col">
                <FormattedMessage id="settings.account.locationAddress" />
              </div>
            </div>
            {
              locations.length ?
              locations :
              <FormattedHTMLMessage id="settings.account.noLocations" />
            }
          </div>
        </div>
        {
          this.props.user.hasEmailProvider ?
          <div className="panel">
            <h2 className="panel-title">Password</h2>
            <div className="panel-content">
              <div styleName="setting-row">
                <div styleName="setting-title">
                  <FormattedMessage id="settings.account.passwordCurrent" />
                </div>
                <div styleName="setting-input">
                  <input
                    type="password"
                    value={this.state.currentPassword}
                    onChange={::this._oncurrentPasswordChange}
                  />
                </div>
              </div>
              <div styleName="setting-row">
                <div styleName="setting-title">
                  <FormattedMessage id="settings.account.passwordNew" />
                </div>
                <div styleName="setting-input">
                  <input
                    type="password"
                    value={this.state.newPassword}
                    onChange={::this._onNewPasswordChange}
                  />
                </div>
              </div>
              <div styleName="setting-row">
                <div styleName="setting-title">
                  <FormattedMessage id="settings.account.passwordConfirm" />
                </div>
                <div styleName="setting-input">
                  <input
                    type="password"
                    value={this.state.newPasswordConfirm}
                    onChange={::this._onNewPasswordConfirmChange}
                  />
                </div>
              </div>
              <button
                className="primary"
                disabled={!this._getCanSavePassword()}
                onClick={::this._onChangePasswordClick}
              >
                Change password
              </button>
            </div>
          </div> :
          null
        }
        <div className="panel">
          <h2 className="panel-title">
            <FormattedMessage id="settings.account.deleteAccount" />
          </h2>
          <div className="panel-content">
            <div styleName="delete-message">
              <FormattedMessage id="settings.account.deleteAccountMessage" />
            </div>
            <button className="border-btn">
              <FormattedMessage id="settings.account.deleteAccountButton" />
            </button>
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
        hasEmailProvider,
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
          ${SaveGeneralSettingsMutation.getFragment('privateData')}
        },
      }
    `,
  },
});
