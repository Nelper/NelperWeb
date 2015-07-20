import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import Progress from 'components/Progress';
import FindNelpActions from 'actions/FindNelpActions';
import FindNelpStore from 'stores/FindNelpStore';

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
            <div className="user-picture" style={{backgroundImage: `url('${a.user.pictureURL}')`}} />
            <div className="username">{a.user.firstName + ' ' + a.user.lastName}</div>
            {this._renderStateBadge(a.state)}
            {a.state === 0 ? (
              <div className="btn-group">
                <button onClick={this._accept.bind(this, a)}>Accept</button>
                <button onClick={this._deny.bind(this, a)}>Deny</button>
              </div>
            ) : null}
          </div>
        );
      });
    }

    return (
      <div id="find-nelp-detail-handler" className="container pad-all">
        <h2>{task.title}</h2>
        <p>{task.desc}</p>
        <button>Edit</button>
        <h3>Applications</h3>
        <div className="applications">
          {applications}
        </div>
        <div className="btn-group">
          <button onClick={this._back.bind(this)}>Back</button>
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
