import React, {Component} from 'react';
import {Button, ButtonToolbar, Input} from 'react-bootstrap';
import {Parse} from 'parse';

export default class LoginHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  state = {
    email: '',
    password: '',
  }

  render() {
    return (
      <div className="container">
        <h2>Login</h2>
        <Input
          type='text'
          value={this.state.email}
          placeholder='Email'
          hasFeedback
          groupClassName='group-class'
          labelClassName='label-class'
          onChange={this._onEmailChanged.bind(this)} />
        <Input
          type='password'
          value={this.state.password}
          placeholder='Password'
          hasFeedback
          groupClassName='group-class'
          labelClassName='label-class'
          onChange={this._onPasswordChanged.bind(this)} />
        <ButtonToolbar>
          <Button bsStyle='primary'>Submit</Button>
          <Button onClick={this._loginWithFacebook.bind(this)}>Login with Facebook</Button>
        </ButtonToolbar>
      </div>
    );
  }

  _onEmailChanged(event) {
    this.setState({
      email: event.target.value,
    });
  }

  _onPasswordChanged(event) {
    this.setState({
      password: event.target.value,
    });
  }

  _loginWithFacebook() {
    Parse.FacebookUtils.logIn(null, {
      success: (user) => {
        if (!user.existed()) {
          this._loginSuccess();
        } else {
          this._loginSuccess();
        }
      },
      error: (user, error) => {
        console.log(error);
      },
    });
  }

  _loginSuccess() {
    if (location.state && location.state.nextPathname) {
      this.context.router.replaceWith(location.state.nextPathname);
    } else {
      this.context.router.replaceWith('/nelp');
    }
  }
}
