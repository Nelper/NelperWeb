import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import moment from 'moment';

import Progress from 'components/Progress';
import Rating from 'components/Rating';
import Dialog from 'components/Dialog';
import FindNelpActions from 'actions/FindNelpActions';
import FindNelpStore from 'stores/FindNelpStore';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

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
    confirmDeleteOpened: false,
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
    let {confirmDeleteOpened} = this.state;
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
      applications = task.applications
      .sort(this._sortTasks)
      .map(a => {
        return (
          <div key={a.objectId} className="application">
            <div className="user-picture" onClick={this._viewProfile.bind(this, a.user)} style={{backgroundImage: `url('${a.user.pictureURL}')`}}>
            {this._renderStateBadge(a.state)}
            </div>
            <div className="user-info">
              <div className="username-row">
                <div className="username">{a.user.name}</div>
                <div className="rating"><Rating rating={3} dark={true} small={true} /></div>
              </div>
              <div className="tasks-completed">8 tasks completed</div>
              <div className="member-since">Member since {moment(a.user.createdAt).format('MMMM Do YYYY')}</div>
            </div>
            {
              a.state === 0 ?
                <div className="btn-group">
                  <button className="primary" onClick={this._accept.bind(this, a)}>Accept</button>
                  <button className="warning" onClick={this._deny.bind(this, a)}>Deny</button>
                </div> :
                null
            }
            <button className="secondary" onClick={this._viewProfile.bind(this, a.user)}>View profile</button>
          </div>
        );
      });
    }

    return (
      <div id="find-nelp-detail-handler">
        <Dialog opened={confirmDeleteOpened}>
          <h1>Warning!</h1>
          <p className="dialog-text">Are your sure you want to delete the task '{task.title}'?</p>
          <div className="btn-group dialog-buttons">
            <button onClick={::this._cancelDelete}>Cancel</button>
            <button onClick={::this._confirmDelete} className="primary">Delete</button>
          </div>
        </Dialog>
        <div className="container pad-all">
          <h2>{task.title}</h2>
          <div className="task-detail">
            {this._renderStatus()}
            <div>Description: {task.desc}</div>
            <div>Offer: {task.priceOffered}</div>
            <div className="btn-group">
              <button className="secondary" onClick={::this._edit}>Edit</button>
              <button className="warning" onClick={::this._delete}>Delete</button>
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
        icon = require('images/icons/state-pending.png');
        break;
      case 2:
        icon = require('images/icons/state-accepted.png');
        break;
      case 3:
        icon = require('images/icons/state-denied.png');
        break;
    }
    return (
      <div className="state-badge" style={{backgroundImage: `url('${icon}')`}} />
    );
  }

  _renderStatus() {
    let hasAcceptedApplication = this.props.task.applications.some(a => a.state === 2);
    let icon = !hasAcceptedApplication ?
      require('images/icons/state-pending.png') :
      require('images/icons/state-accepted.png');
    let text = !hasAcceptedApplication ? 'Pending' : 'Accepted';
    return (
      <div className="status">
        <div>Status: </div>
        <div className="status-icon" style={{backgroundImage: `url('${icon}')`}} />
        <div>{text}</div>
      </div>
    );
  }

  _edit() {

  }

  _delete() {
    this.setState({confirmDeleteOpened: true});
  }

  _confirmDelete() {
    FindNelpActions.deleteTask(this.props.task);
    this.context.router.goBack();
  }

  _cancelDelete() {
    this.setState({confirmDeleteOpened: false});
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

  _sortTasks(a, b) {
    function toOrder(ele) {
      switch(ele.state) {
      case NELP_TASK_APPLICATION_STATE.ACCEPTED:
        return 10;
      case NELP_TASK_APPLICATION_STATE.PENDING:
        return 20;
      case NELP_TASK_APPLICATION_STATE.DENIED:
        return 30;
      }
    }

    return toOrder(a) > toOrder(b) ? 1 : -1;
  }
}
