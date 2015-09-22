import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {Link} from 'react-router';

import styles from './SettingsHandler.scss';

@cssModules(styles)
export default class SettingsHandler extends Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div styleName="module" className="container">
        <div styleName="header">Settings</div>
        <div styleName="content">
          <ul styleName="menu" className="panel">
            <li styleName="menu-item">
              <Link to="/settings/account" activeClassName="active">
                Account settings
              </Link>
            </li>
            <li styleName="menu-item">
              <Link to="/settings/notifications" activeClassName="active">
                Notifications
              </Link>
            </li>
            <li styleName="menu-item">
              <Link to="/settings/nelperpay" activeClassName="active">
                NelperPay
              </Link>
            </li>
            <li styleName="menu-item">
              <Link to="/settings/history" activeClassName="active">
                Transaction history
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
