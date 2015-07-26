import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import moment from 'moment';

import Progress from 'components/Progress';
import Rating from 'components/Rating';
import FindNelpActions from 'actions/FindNelpActions';
import FindNelpStore from 'stores/FindNelpStore';

import FindNelpProfileHandler from './FindNelpProfileHandler';

@connectToStores
export default class FindNelpDetailHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [FindNelpStore];
  }

  static getPropsFromStores(props) {
    let tasks = FindNelpStore.getState().myTasks;
    let task = tasks.find(t => t.objectId === props.params.id);
    if(!task) {
      FindNelpActions.refreshMyTasks();
      return {
        isLoading: true,
        task: null,
      };
    }

    return {
      isLoading: false,
      task: task,
    };
  }

  state = {
    selectedUser: null,
  }

  _setTaskAsViewed = false

  componentDidUpdate() {
    // Mark the task as viewed once it's loaded.
    if(!this._setTaskAsViewed && this.props.task) {
      this._setTaskAsViewed = true;
      // Have to do this to avoid fireing this action in the
      // middle of a dispatch.
      setTimeout(() => {
        FindNelpActions.setTaskViewed(this.props.task);
      }, 0);
    }
  }

  render() {
    let {task, isLoading} = this.props;
    if(isLoading) {
      return (
        <div className="container pad-all center">
          <Progress />
        </div>
      );
    }

    let applications;
    if(task.applications.length === 0) {
      applications = <div>No applications yet!</div>;
    } else {
      applications = task.applications.map((a) => {
        return (
          <div key={a.objectId} className="application">
            <div className="user-picture" onClick={this._viewProfile.bind(this, a.user)} style={{backgroundImage: `url('${a.user.pictureURL}')`}}>
            {this._renderStateBadge(a.state)}
            </div>
            <div className="user-info">
              <div className="username-row">
                <div className="username">{a.user.firstName + ' ' + a.user.lastName}</div>
                <div className="rating"><Rating rating={3} dark={true} small={true} /></div>
              </div>
              <div className="tasks-completed">8 tasks completed</div>
              <div className="member-since">Member since {moment(a.user.createdAt).format('MMMM Do YYYY')}</div>
            </div>
            {
              a.state === 0 ?
                <div className="btn-group">
                  <button className="green" onClick={this._accept.bind(this, a)}>Accept</button>
                  <button className="primary" onClick={this._deny.bind(this, a)}>Deny</button>
                </div> :
                null
            }
            <button className="blue" onClick={this._viewProfile.bind(this, a.user)}>View profile</button>
          </div>
        );
      });
    }

    return (
      <div id="find-nelp-detail-handler">
        <div className="container pad-all">
          <h2>{task.title}</h2>
          <div className="task-detail">
            <div>Description: {task.desc}</div>
            <div>Offer: {task.priceOffered}</div>
            <div className="btn-group">
              <button className="blue" onClick={::this._edit}>Edit</button>
              <button className="primary" onClick={::this._delete}>Delete</button>
              <button onClick={::this._back}>Back</button>
            </div>
          </div>
        </div>
        <div className="section-separator"/>
        <div className="container pad-all">
          <h2>Applicants</h2>
          <div className="applications">
            {applications}
          </div>
          <FindNelpProfileHandler user={this.state.selectedUser} onClose={::this._onProfileClose} />
        </div>
      </div>
    );
  }

  _renderStateBadge(state) {
    let icon;
    switch (state) {
      case 0:
        icon = require('images/icons/pending-yellow.png');
        break;
      case 2:
        icon = require('images/icons/accepted-green.png');
        break;
      case 3:
        icon = require('images/icons/denied-red.png');
        break;
    }
    return (
      <div className="state-badge" style={{backgroundImage: `url('${icon}')`}} />
    );
  }

  _edit() {

  }

  _delete() {

  }

  _viewProfile(user) {
    this.setState({selectedUser: user});
  }

  _onProfileClose() {
    this.setState({selectedUser: null});
  }

  _accept(application) {
    FindNelpActions.acceptApplication(application);
  }

  _deny(application) {
    FindNelpActions.denyApplication(application);
  }

  _back() {
    this.context.router.goBack();
  }
}
