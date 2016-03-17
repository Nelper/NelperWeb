import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {Link} from 'react-router';
import {FormattedMessage} from 'react-intl';

import styles from './SettingsHandler.scss';

@cssModules(styles)
export default class SettingsHandler extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div styleName="module" className="container">
        <div styleName="header"><FormattedMessage id="settings.common.settings" /></div>
        <div styleName="content">
          <ul styleName="menu" className="panel">
            <li styleName="menu-item">
              <Link to="/settings/account" activeClassName="active">
                <FormattedMessage id="settings.account.title" />
              </Link>
            </li>
            <li styleName="menu-item">
              <Link to="/settings/notifications" activeClassName="active">
                <FormattedMessage id="settings.notifications.title" />
              </Link>
            </li>
            <li styleName="menu-item">
              <Link to="/settings/nelperpay" activeClassName="active">
                <FormattedMessage id="settings.nelperpay.title" />
              </Link>
            </li>
            <li styleName="menu-item">
              <Link to="/settings/history" activeClassName="active">
                <FormattedMessage id="settings.history.title" />
              </Link>
            </li>
          </ul>
          <div styleName="setting-page">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
