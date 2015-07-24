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
            <div className="user-picture" onClick={this._viewProfile.bind(this, a.user)} style={{backgroundImage: `url('${a.user.pictureURL}')`}} />
            <div className="user-info">
              <div className="username-row">
                <div className="username">{a.user.firstName + ' ' + a.user.lastName}</div>
                <div className="rating"><Rating rating="3" dark={true} small={true} /></div>
              </div>
              <div className="tasks-completed">8 tasks completed</div>
              <div className="member-since">Member since {moment(a.user.createdAt).format('MMMM Do YYYY')}</div>
            </div>
            <button className="blue" onClick={this._viewProfile.bind(this, a.user)}>View profile</button>
            {a.state === 0 ? (
              <div className="btn-group">
                <button className="primary" onClick={this._accept.bind(this, a)}>Accept</button>
                <button className="primary" onClick={this._deny.bind(this, a)}>Deny</button>
              </div>
            ) : null}
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
              <button onClick={::this._delete}>Delete</button>
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
    let text, color;
    switch (state) {
      case 0:
        text = 'Applied';
        color = '#123456';
        break;
      case 1:
        text = 'Canceled';
        color = '#654321';
        break;
      case 2:
        text = 'Accepted';
        color = '#00FF00';
        break;
      case 3:
        text = 'Denied';
        color = '#FF0000';
        break;
    }
    return (
      <div className="state-badge" style={{backgroundColor: color}}>{text}</div>
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
