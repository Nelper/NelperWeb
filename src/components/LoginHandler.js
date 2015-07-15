import React, {Component} from 'react';
import {Parse} from 'parse';

export default class LoginHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    email: '',
    password: '',
  }

  render() {
    return (
      <div className="page-container">
        <h2>Login</h2>
        <input
          type='text'
          value={this.state.email}
          placeholder='Email'
          onChange={this._onEmailChanged.bind(this)} />
        <input
          type='password'
          value={this.state.password}
          placeholder='Password'
          onChange={this._onPasswordChanged.bind(this)} />
        <div>
          <button>Submit</button>
          <button onClick={this._loginWithFacebook.bind(this)}>Login with Facebook</button>
        </div>
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
