import React, {Component} from 'react';
import moment from 'moment';
import connectToStores from 'alt/utils/connectToStores';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import Rating from 'components/Rating';
import ApiUtils from 'utils/ApiUtils';

@connectToStores
export default class ProfileHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  render() {
    let {user} = this.props;

    return (
      <div id="profile-handler">
        <div className="header">
          <div className="container pad-all">
            <div className="picture-picker">
              <div
                style={{backgroundImage: `url('${user.pictureURL}')`}}
                className="picture" />
              <input type="file" onChange={::this._uploadPicture} />
            </div>
            <div className="info-container">
              <div className="user-name">
                {user.name}
              </div>
              <Rating rating={4}/>
              <div className="member-since">
                Member since {moment(user.createdAt).format('MMMM Do YYYY')}
              </div>
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
        <div className="tabs">
          <div className="container pad-hor">
            <div className="tab active">Active Tasks</div>
            <div className="tab">Completed Tasks</div>
          </div>
        </div>
        <div className="container pad-all">
          Task list
        </div>
      </div>
    );
  }

  _logout() {
    UserActions.logout();
    this.context.router.transitionTo('/');
  }

  _settings() {
    this.context.router.transitionTo('/profile/settings');
  }

  _uploadPicture() {
    let files = event.target.files;
    if(files.length > 0) {
      let file = files[0];
      ApiUtils.uploadFile(file.name, file)
        .then(f => {
          UserActions.setPicture(f);
        });
    }
  }
}
