import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import FindNelpCardView from './FindNelpCardView';
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
    let tasks = this.props.myTasks
    .sort(this._sortTasks)
    .map((t) => {
      return (
        <FindNelpCardView task={t} onClick={() => this._taskDetail(t)} />
      );
    });
    return (
      <div id="find-nelp-handler">
        <div className="header-section">
          <div className="add-task" onClick={::this._addNelpTask}>
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
          {tasks}
        </div>
      </div>
    );
  }

  /**
   * Sort tasks with isNew first
   */
  _sortTasks(t1, t2) {
    function hasNew(t) {
      return t.applications.some(a => a.state === 0 && a.isNew);
    }

    let [n1, n2] = [hasNew(t1), hasNew(t2)];
    if(n1 === n2) {
      return 0;
    } else if(n1 > n2) {
      return -1;
    } else {
      return 1;
    }
  }

  _addNelpTask() {
    this.context.router.transitionTo('/findnelp/add');
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/findnelp/detail/${task.objectId}`, null, {task});
  }
}
