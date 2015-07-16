import React, {Component} from 'react';
import {Parse} from 'parse';

export default class FindNelpDetailHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    applied: this.props.location.state.task.application
      && this.props.location.state.task.application.state === 0,
  }

  render() {
    let {title, desc} = this.props.location.state.task;

    return (
      <div className="container pad-all">
        <h2>{title}</h2>
        <p>{desc}</p>
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
    if(this.props.location.state.task.application) {
      this._setTaskApplicationState(0);
    } else {
      let Task = new Parse.Object.extend({
          className: 'Task',
      });
      let task = new Task();
      task.id = this.props.location.state.task.objectId;
      let TaskApplication = new Parse.Object.extend({
          className: 'TaskApplication',
      });
      let taskApplication = new TaskApplication();
      taskApplication.set('state', 0);
      taskApplication.set('user', Parse.User.current());
      taskApplication.set('task', task);
      taskApplication.save();
      this.props.location.state.task.application = taskApplication.toPlainObject();
    }
  }

  _cancelApplication() {
    this.setState({applied: false});
    this._setTaskApplicationState(1);
  }

  _setTaskApplicationState(state) {
    let TaskApplication = new Parse.Object.extend({
        className: 'TaskApplication',
    });
    let taskApplication = new TaskApplication();
    taskApplication.id = this.props.location.state.task.application.objectId;
    taskApplication.set('state', state);
    taskApplication.save();
  }

  _back() {
    this.context.router.goBack();
  }
}
