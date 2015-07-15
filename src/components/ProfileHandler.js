import React, {Component} from 'react';

export default class ProfileHandler extends Component {
  render() {
    return (
      <div id="page-profile">
        <div className="header">
          <div className="container">
            <div style={{backgroundImage: 'url(http://www.independent.co.uk/incoming/article8465213.ece/alternates/w620/v2-cute-cat-picture.jpg)'}}
                  className="user-picture" />
            <div className="info-container">
              <div className="user-name">
                Jane Mills
              </div>
              <div className="rating">*****</div>
              <div className="tasks-summary">8 Tasks Completed</div>
            </div>
            <button>Settings</button>
          </div>
        </div>
        <div className="tabs">
          <div className="container">
            <div className="tab active">Active Tasks</div>
            <div className="tab">Completed Tasks</div>
          </div>
        </div>
        <div className="container">
          Task list
        </div>
      </div>
    );
  }
}
