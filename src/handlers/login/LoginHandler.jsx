import React, {Component} from 'react';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';

export default class LoginHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static showNavBar() {
    return true;
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
      <div id="login-handler" className="login-common">
        <div className="content">
          <img
              className="nelpy"
              src={require('images/logo-nobg-lg.png')} />
          <h2 className="title">Nelper</h2>
          <form onSubmit={::this._onSubmit}>
            <input
                type='email'
                value={this.state.email}
                placeholder='Email'
                onChange={this._onEmailChanged.bind(this)} />
            <input
                type='password'
                value={this.state.password}
                placeholder='Password'
                onChange={this._onPasswordChanged.bind(this)} />
            <button className="login" onClick={::this._login}>Login</button>
          </form>
          <button className="facebook"
              onClick={this._loginWithFacebook.bind(this)}>
            Sign in with Facebook
          </button>
          <button
              onClick={::this._register}
              className="register">
            Register with Email
          </button>
          <a className="forgot" href="/">I forgot my password</a>
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

  _onSubmit(event) {
    event.preventDefault();
    this._login();
  }

  _login() {
    UserActions.login({
      email: this.state.email,
      password: this.state.password,
    });
  }

  _loginWithFacebook() {
    UserActions.loginWithFacebook();
  }

  _register() {
    this.context.router.transitionTo('/register', null, { nextPathname: this.props.location.state.nextPathname });
  }

  _onUserChanged(state) {
    if(state.user) {
      this._loginSuccess();
    }
  }

  _loginSuccess() {
    let {state} = this.props.location;
    if (state && state.nextPathname) {
      this.context.router.replaceWith(state.nextPathname);
    } else {
      this.context.router.replaceWith('/nelp');
    }
  }
}
