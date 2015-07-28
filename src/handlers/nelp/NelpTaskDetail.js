import React, {Component} from 'react';

import NelpActions from 'actions/NelpActions';
import UserStore from 'stores/UserStore';

export default class NelpTaskDetail extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    onClose: React.PropTypes.func.isRequired,
  }

  state = {
    applied: this.props.task &&
      this.props.task.application &&
      this.props.task.application.state === 0,
  }

  render() {
    let {task} = this.props;

    return (
      <div id="nelp-task-detail-view">
        <h2>{task.title}</h2>
        <div className="task-detail">
          <div>Category: Technology</div>
          <div>{task.desc}</div>
          <div>Offer: {task.priceOffered}</div>
          <div className="btn-group">
            {
              this.state.applied ?
              <button className="primary" onClick={this._cancelApplication.bind(this)}>
                Cancel application
              </button> :
              <button className="primary" onClick={this._apply.bind(this)}>
                Apply!
              </button>
            }
            <button onClick={::this._close}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  _apply() {
    // Make sure the user is logged to apply on a task.
    if(!UserStore.state.user) {
      this.context.router.transitionTo('/login', null, { nextPathname: '/nelp' });
      return;
    }
    this.setState({applied: true});
    NelpActions.applyForTask(this.props.task);
  }

  _cancelApplication() {
    this.setState({applied: false});
    NelpActions.cancelApplyForTask(this.props.task);
  }

  _close() {
    this.props.onClose();
  }
}
