import React, {Component} from 'react';
import {Button, ButtonToolbar, Input} from 'react-bootstrap';
import {Parse} from 'parse';
import ParseReact from 'parse-react';

export default class FindNelpDetailHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    applied: this.props.location.state.task.applications &&
      this.props.location.state.task.applications.length > 0,
  }

  render() {
    let {title, desc} = this.props.location.state.task;

    return (
      <div className="container">
        <h2>{title}</h2>
        <p>{desc}</p>
        <ButtonToolbar>
          {
            this.state.applied ?
            <Button onClick={this._cancelApplication.bind(this)} bsStyle="warning">
              Cancel application
            </Button> :
            <Button onClick={this._apply.bind(this)} bsStyle="primary">
              Apply
            </Button>
          }
          <Button onClick={this._back.bind(this)}>Back</Button>
        </ButtonToolbar>
      </div>
    );
  }

  _apply() {
    this.setState({applied: true});
    ParseReact.Mutation.Add(this.props.location.state.task, 'applications', {
      state: 0,
      user: Parse.User.current(),
      task: this.props.location.state.task,
    }).dispatch();
  }

  _cancelApplication() {
    this.setState({applied: false});
  }

  _back() {
    this.context.router.goBack();
  }
}
