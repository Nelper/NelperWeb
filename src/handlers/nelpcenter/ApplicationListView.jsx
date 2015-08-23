import React, {Component, PropTypes} from 'react';

import Rating from 'components/Rating';

export default class ApplicationListView extends Component {

  static propTypes = {
    applications: PropTypes.array.isRequired,
    onAccept: PropTypes.func,
    onDeny: PropTypes.func,
    onRestore: PropTypes.func,
    onViewProfile: PropTypes.func,
  }

  _onAccept(application) {
    this.props.onAccept && this.props.onAccept(application);
  }

  _onDeny(application) {
    this.props.onDeny && this.props.onDeny(application);
  }

  _onRestore(application) {
    this.props.onRestore && this.props.onRestore(application);
  }

  _onViewProfile(application) {
    this.props.onViewProfile && this.props.onViewProfile(application);
  }

  render() {
    const applications = !this.props.applications.length ?
      <div>No applications yet!</div> :
      this.props.applications.map(a => {
        return (
          <div key={a.objectId} className="application">
            <div className="user-profile">
              <div className="user-picture"
                onClick={() => this._onViewProfile(a.user)}
                style={{backgroundImage: `url('${a.user.pictureURL}')`}}
              >
                <div className="user-picture-overlay">
                  <div className="view-profile-icon" />
                  <div className="view-profile-text">View Profile</div>
                </div>
              </div>
              <div className="user-info">
                <div className="user-info-name">{a.user.name}</div>
                <Rating rating={3} dark={true} small={true} />
                <div className="user-info-tasks-completed">
                  8 tasks completed
                </div>
              </div>
            </div>
            <div className="price-offered">
              <div className="price-offered-icon" />
              Asking for ${a.task.priceOffered}
            </div>
            {
              a.state === 0 ?
              <div className="btn-group actions">
                <div className="btn-accept" onClick={() => this._onAccept(a)} />
                <div className="btn-deny" onClick={() => this._onDeny(a)} />
              </div> :
              <div className="btn-group actions">
                <div className="btn-restore" onClick={() => this._onRestore(a)} />
              </div>
            }
          </div>
        );
      });

    return (
      <div className="application-list-view">
        {applications}
      </div>
    );
  }
}
