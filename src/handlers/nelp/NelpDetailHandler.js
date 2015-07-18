import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import NelpActions from 'actions/NelpActions';
import NelpStore from 'stores/NelpStore';
import Progress from 'components/Progress';

@connectToStores
export default class FindNelpDetailHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    applied: this.props.task &&
      this.props.task.application &&
      this.props.task.application.state === 0,
  }

  static getStores() {
    return [NelpStore];
  }

  static getPropsFromStores(props) {
    let tasks = NelpStore.getState().tasks;
    let task = tasks.find(t => t.objectId === props.params.id);
    if(!task) {
      NelpActions.refreshTasks();
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

    return (
      <div className="container pad-all">
        <h2>{task.title}</h2>
        <p>{task.desc}</p>
        <div>
          {
            this.state.applied ?
            <button onClick={this._cancelApplication.bind(this)}>
              Cancel application
            </button> :
            <button onClick={this._apply.bind(this)}>
              Apply
            </button>
          }
          <button onClick={this._back.bind(this)}>Back</button>
        </div>
      </div>
    );
  }

  _apply() {
    this.setState({applied: true});
    NelpActions.applyForTask(this.props.task);
  }

  _cancelApplication() {
    this.setState({applied: false});
    NelpActions.cancelApplyForTask(this.props.task);
  }

  _back() {
    this.context.router.goBack();
  }
}
