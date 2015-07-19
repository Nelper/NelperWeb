import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import classNames from 'classnames';

import FindNelpActions from 'actions/FindNelpActions';
import FindNelpStore from 'stores/FindNelpStore';

@connectToStores
export default class FindNelpHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [FindNelpStore];
  }

  static getPropsFromStores() {
    return FindNelpStore.getState();
  }

  componentDidMount() {
    FindNelpActions.refreshMyTasks();
  }

  render() {
    let requests = this.props.myTasks.map((r) => {
      let hasActiveApplications = r.applications.filter(a => a.state === 0).length > 0;
      return (
        <div className="task" key={r.objectId} onClick={this._taskDetail.bind(this, r)}>
          <div className="new">{hasActiveApplications ? 'new!' : ''}</div>
          <div className={classNames(
            'icon',
            {'active': hasActiveApplications}
          )} />
          <div className="title">{r.title}</div>
        </div>
      );
    });
    return (
      <div id="find-nelp-handler">
        <div className="header-section">
          <div className="add-task" onClick={this._addNelpTask.bind(this)}>
            <img className="add-image" src={require('images/plus-512-white.png')} />
            <h2 className="add-title">Ask for Nelp!</h2>
          </div>
        </div>
        <div className="title-section">
          <div className="container pad-all">
            <div className="title">My Nelp Requests</div>
          </div>
        </div>
        <div className="container pad-all tasks">
          {requests}
        </div>
      </div>
    );
  }

  _addNelpTask() {
    this.context.router.transitionTo('/findnelp/add');
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/findnelp/detail/${task.objectId}`, null, {task});
  }
}
