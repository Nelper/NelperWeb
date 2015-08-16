import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import connectToStores from 'alt/utils/connectToStores';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import Rating from 'components/Rating';

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
      this.context.router.replaceWith('/center/applications');
    }
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
        <div className="header">
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
              <Rating rating={4} small={true}/>
              <div className="tasks-summary">8 Tasks Completed</div>
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
            <Link className="tab" to="/center/applications">
              My Applications
            </Link>
            <Link className="tab" to="/center/tasks">
              My Tasks
            </Link>
            <Link className="tab" to="/center/profile">
              Profile
            </Link>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
