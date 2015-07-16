import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import NelpActions from 'actions/NelpActions';
import NelpStore from 'stores/NelpStore';

@connectToStores
export default class NelpHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [NelpStore];
  }

  static getPropsFromStores() {
    return NelpStore.getState();
  }

  componentDidMount() {
    NelpActions.refreshTasks();
  }

  render() {
    let tasks = this.props.tasks.map((t) => {
      return (
        <div key={t.objectId} onClick={this._taskDetail.bind(this, t)}>{t.title}</div>
      );
    });
    return (
      <div className="container pad-all">
        <h2>Nelp</h2>
        <div>
          {tasks}
        </div>
      </div>
    );
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/nelp/detail/${task.objectId}`, null, {task});
  }
}
