import React, {Component} from 'react';

import {Parse} from 'parse';
import ParseReact from 'parse-react';

export default class FindNelpDetailHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    title: this.props.location.state.task.title, //euhhh
    desc: this.props.location.state.task.desc,
  }

  render() {
    return (
      <div className="container">
        <h2>Nelp request</h2>
        <input
          type='text'
          value={this.state.title}
          placeholder='Title'
          hasFeedback
          groupClassName='group-class'
          labelClassName='label-class'
          onChange={this._onTitleChanged.bind(this)} />
        <input
          type='text'
          value={this.state.desc}
          placeholder='Description'
          hasFeedback
          groupClassName='group-class'
          labelClassName='label-class'
          onChange={this._onDescChanged.bind(this)} />
        <div>
          <button
            disabled={!this.state.title || !this.state.desc}
            onClick={this._create.bind(this)}
            bsStyle='success'>Update</button>
          <button bsStyle='danger' onClick={this._delete.bind(this)}>Delete</button>
          <button onClick={this._cancel.bind(this)}>Cancel</button>
        </div>
      </div>
    );
  }

  _onTitleChanged(event) {
    this.setState({
      title: event.target.value,
    });
  }

  _onDescChanged(event) {
    this.setState({
      desc: event.target.value,
    });
  }

  _create() {
    ParseReact.Mutation.Create('Task', {
      title: this.state.title,
      desc: this.state.desc,
      user: Parse.User.current(),
    }).dispatch();
    this.context.router.goBack();
  }

  _delete() {

  }

  _cancel() {
    this.context.router.goBack();
  }
}
