import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import UserStore from 'stores/UserStore';
import Rating from 'components/Rating';

@connectToStores
export default class ProfileHandler extends Component {

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  render() {

    return (
      <div id="profile-handler">
        <div className="header">
          <div className="container pad-all">
            <div style={{backgroundImage: `url('${this.props.user.pictureURL}')`}}
                  className="user-picture" />
            <div className="info-container">
              <div className="user-name">
                Jane Mills
              </div>
              <Rating rating={4} />
              <div className="tasks-summary">8 Tasks Completed</div>
            </div>
            <button>Settings</button>
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
}
