import React, {Component} from 'react';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';

export default class LoginHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    email: '',
    password: '',
  }
  userStoreListener = this._onUserChanged.bind(this)

  componentDidMount() {
    UserStore.listen(this.userStoreListener);
  }

  componentWillUnmount() {
    UserStore.unlisten(this.userStoreListener);
  }

  render() {
    return (
      <div className="container pad-all">
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
        <div className="btn-group">
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
    UserActions.loginWithFacebook();
  }

  _onUserChanged(state) {
    if(state.user) {
      this._loginSuccess();
    }
  }

  _loginSuccess() {
    if (location.state && location.state.nextPathname) {
      this.context.router.replaceWith(location.state.nextPathname);
    } else {
      this.context.router.replaceWith('/nelp');
    }
  }
}
