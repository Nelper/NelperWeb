import React, {Component, PropTypes} from 'react';
import invariant from 'invariant';
import connectToStores from 'alt/utils/connectToStores';
import moment from 'moment';

import Progress from 'components/Progress';
import Rating from 'components/Rating';
import Dialog from 'components/Dialog';
import Editable from 'components/Editable';
import TaskActions from 'actions/TaskActions';
import TaskStore from 'stores/TaskStore';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

import ViewProfileHandler from './ViewProfileHandler';

@connectToStores
export default class TaskDetailHandler extends Component {

  static propTypes = {
    task: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [TaskStore];
  }

  static getPropsFromStores(props) {
    const tasks = TaskStore.getState().myTasks;
    const task = tasks.find(t => t.objectId === props.params.id);
    if (!task) {
      TaskActions.refreshMyTasks();
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
  };

  constructor(props) {
    super(props);
    this._setTaskAsViewed = false;
  }

  componentDidMount() {
    this._markTaskViewed();
  }

  componentDidUpdate() {
    this._markTaskViewed();
  }

  _markTaskViewed() {
    if (!this._setTaskAsViewed && this.props.task) {
      this._setTaskAsViewed = true;
      // Have to do this to avoid fireing this action in the
      // middle of a dispatch.
      setTimeout(() => {
        TaskActions.setTaskViewed(this.props.task);
      }, 0);
    }
  }

  _onDescChanged(desc) {
    const task = this.props.task;
    task.desc = desc;
    TaskActions.updateTask(task);
  }

  _delete() {
    this.setState({confirmDeleteOpened: true});
  }

  _confirmDelete() {
    TaskActions.deleteTask(this.props.task);
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
    TaskActions.acceptApplication(application);
  }

  _deny(application) {
    TaskActions.denyApplication(application);
  }

  _back() {
    this.context.router.goBack();
  }

  _sortTasks(a, b) {
    function toOrder(ele) {
      switch (ele.state) {
      case NELP_TASK_APPLICATION_STATE.ACCEPTED:
        return 10;
      case NELP_TASK_APPLICATION_STATE.PENDING:
        return 20;
      case NELP_TASK_APPLICATION_STATE.DENIED:
        return 30;
      default:
        invariant(false, 'Unknown task state');
      }
    }

    return toOrder(a) > toOrder(b) ? 1 : -1;
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
    default:
      invariant(false, `Invalid task state. State: ${state}`);
    }
    return (
      <div className="state-badge" style={{backgroundImage: `url('${icon}')`}} />
    );
  }

  _renderStatus() {
    const hasAcceptedApplication = this.props.task.applications.some(a => a.state === 2);
    const icon = !hasAcceptedApplication ?
    require('images/icons/state-pending.png') :
    require('images/icons/state-accepted.png');
    const text = !hasAcceptedApplication ? 'Pending' : 'Accepted';
    return (
      <div className="detail-status">
        <div>Status: </div>
        <div className="detail-status-icon" style={{backgroundImage: `url('${icon}')`}} />
        <div>{text}</div>
      </div>
    );
  }

  render() {
    const {task, isLoading} = this.props;
    const {confirmDeleteOpened} = this.state;
    if (isLoading) {
      return (
        <div className="container pad-all center">
          <Progress />
        </div>
      );
    }

    let applications;
    if (task.applications.length === 0) {
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
              <div className="user-info-name-row">
                <div className="user-info-name">{a.user.name}</div>
                <Rating rating={3} dark={true} small={true} />
              </div>
              <div className="user-info-tasks-completed">
                8 tasks completed
              </div>
              <div className="user-info-member-since">
                Member since {moment(a.user.createdAt).format('MMMM Do YYYY')}
              </div>
            </div>
            {
              a.state === 0 ?
              <div className="btn-group">
                <button className="primary" onClick={this._accept.bind(this, a)}>
                  Accept
                </button>
                <button className="warning" onClick={this._deny.bind(this, a)}>
                  Deny
                </button>
              </div> :
              null
            }
            <button className="secondary" onClick={this._viewProfile.bind(this, a.user)}>
              View profile
            </button>
          </div>
        );
      });
    }

    return (
      <div className="find-nelp-detail-handler">
        <Dialog opened={confirmDeleteOpened}>
          <h1>Warning!</h1>
          <p className="dialog-text">Are your sure you want to delete the task '{task.title}'?</p>
          <div className="btn-group dialog-buttons">
            <button onClick={::this._cancelDelete}>
              Cancel
            </button>
            <button onClick={::this._confirmDelete} className="primary">
              Delete
            </button>
          </div>
        </Dialog>
        <div className="detail-container container pad-all">
          <button className="back" onClick={::this._back}>Back</button>
          <h2>{task.title}</h2>
          <div className="detail">
            <div className="detail-row description">
              <Editable
                multiline={true}
                onEditDone={::this._onDescChanged}
                initialValue={task.desc}
                />
            </div>
            <div className="detail-row">
              <div className="detail-icon applicants-count" />
              <div className="detail-text">{task.applications.length} applicants</div>
            </div>
            <div className="detail-row">
              <div className="detail-icon price-offered" />
              <div className="detail-text">My offer: ${task.priceOffered}</div>
            </div>
            <div className="detail-row">
              <div className="detail-icon calendar" />
              <div className="detail-text">
                <div>Posted {moment(task.createdAt).fromNow()}</div>
                <div>Expires {moment(task.createdAt).add(15, 'days').fromNow()}</div>
              </div>
            </div>
            <div className="btn-group">
              <button className="warning" onClick={::this._delete}>Delete</button>
            </div>
          </div>
        </div>
        <div className="container pad-all">
          <h2>Applicants</h2>
          <div className="applications">
            {applications}
          </div>
          <ViewProfileHandler
            user={this.state.selectedUser}
            onClose={::this._onProfileClose} />
        </div>
      </div>
    );
  }
}
