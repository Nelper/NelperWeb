import React, {Component} from 'react';

import FindNelpActions from '../actions/FindNelpActions';

export default class FindNelpAddHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    title: '',
    desc: '',
  }

  render() {
    return (
      <div className="page-container">
        <h2>Ask for Nelp</h2>
        <input
          type='text'
          value={this.state.title}
          placeholder='Title'
          onChange={this._onTitleChanged.bind(this)} />
        <input
          type='text'
          value={this.state.desc}
          placeholder='Description'
          onChange={this._onDescChanged.bind(this)} />
        <div>
          <button
            disabled={!this.state.title || !this.state.desc}
            onClick={this._create.bind(this)}>Create</button>
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
    FindNelpActions.addTask({
      title: this.state.title,
      desc: this.state.desc,
    });
    this.context.router.goBack();
  }

  _cancel() {
    this.context.router.goBack();
  }
}
