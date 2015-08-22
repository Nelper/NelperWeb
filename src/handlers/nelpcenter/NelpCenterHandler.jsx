import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import connectToStores from 'alt/utils/connectToStores';

import UserActions from 'actions/UserActions';
import AppActions from 'actions/AppActions';
import UserStore from 'stores/UserStore';
import AppStore from 'stores/AppStore';

@connectToStores
export default class NelpCenterHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
    children: PropTypes.node,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  componentDidMount() {
    if (!this.props.children) {
      this._redirectToSelectedTab();
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.children) {
      this._redirectToSelectedTab();
    } else {
      const path = newProps.location.pathname;
      if (path !== `/center/${AppStore.state.nelpCenter.selectedTab}`) {
        if (path === '/center/applications') {
          // Prevents dispatch error... TODO: Find a better way to handle this.
          setTimeout(() => AppActions.setSelectedTab('applications'), 0);
        } else {
          setTimeout(() => AppActions.setSelectedTab('tasks'), 0);
        }
      }
    }
  }

  _redirectToSelectedTab() {
    this.context.router.replaceWith(`/center/${AppStore.state.nelpCenter.selectedTab}`);
  }

  _logout() {
    UserActions.logout();
    this.context.router.transitionTo('/');
  }

  _settings() {
    this.context.router.transitionTo('/profile/settings');
  }

  _uploadPicture() {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      ApiUtils.uploadFile(file.name, file)
        .then(f => {
          UserActions.setPicture(f);
        });
    }
  }

  render() {
    const {user} = this.props;

    return (
      <div className="nelp-center-handler">
        <div className="profile-header">
          <div className="container header-container pad-all">
            <div className="picture-picker">
              <div
                className="picture"
                style={{backgroundImage: `url('${user.pictureURL}')`}} />
              <input type="file" onChange={::this._uploadPicture} />
            </div>
            <div className="info-container">
              <div className="user-name">
                {user.name}
              </div>
              <Link className="my-profile" to="/center/profile">
                <div className="my-profile-icon" />
                <button className="dark-small">MY PROFILE</button>
              </Link>
            </div>
            <div>
            <div className="btn-group">
              <button className="secondary" onClick={::this._settings}>Settings</button>
              <button className="secondary" onClick={::this._logout}>Logout</button>
            </div>
            </div>
          </div>
        </div>
        <div className="tab-bar">
          <div className="tabs">
            <Link className="tab" to="/center/tasks">
              My Tasks
            </Link>
            <Link className="tab" to="/center/applications">
              My Applications
            </Link>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
