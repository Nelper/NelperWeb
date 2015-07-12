import React, {Component} from 'react';
import {Button, ButtonToolbar, Input} from 'react-bootstrap';
import {Parse} from 'parse';
import ParseReact from 'parse-react';

export default class AddNelpRequestHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    title: '',
    desc: '',
  }

  render() {
    return (
      <div className="container">
        <h2>Create Nelp request</h2>
        <Input
          type='text'
          value={this.state.title}
          placeholder='Title'
          hasFeedback
          groupClassName='group-class'
          labelClassName='label-class'
          onChange={this._onTitleChanged.bind(this)} />
        <Input
          type='text'
          value={this.state.desc}
          placeholder='Description'
          hasFeedback
          groupClassName='group-class'
          labelClassName='label-class'
          onChange={this._onDescChanged.bind(this)} />
        <ButtonToolbar>
          <Button
            disabled={!this.state.title || !this.state.desc}
            onClick={this._create.bind(this)}
            bsStyle='primary'>Create</Button>
          <Button onClick={this._cancel.bind(this)}>Cancel</Button>
        </ButtonToolbar>
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
    ParseReact.Mutation.Create('Offer', {
      title: this.state.title,
      desc: this.state.desc,
      user: Parse.User.current(),
    }).dispatch();
    this.context.router.goBack();
  }

  _cancel() {
    this.context.router.goBack();
  }
}
