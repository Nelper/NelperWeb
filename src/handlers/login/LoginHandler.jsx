import React, {Component, PropTypes} from 'react';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';

export default class LoginHandler extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  static showNavBar() {
    return true;
  }

  state = {
    email: '',
    password: '',
  }

  constructor(props) {
    super(props);

    this.userStoreListener = this._onUserChanged.bind(this);
  }

  componentDidMount() {
    UserStore.listen(this.userStoreListener);
  }

  componentWillUnmount() {
    UserStore.unlisten(this.userStoreListener);
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

  _onLogin() {
    UserActions.login({
      email: this.state.email,
      password: this.state.password,
    });
  }

  _onLoginWithFacebook() {
    UserActions.loginWithFacebook();
  }

  _onRegister() {
    this.context.history.pushState({nextPathname: this.props.location.state.nextPathname}, '/register');
  }

  _onUserChanged(state) {
    if (state.user) {
      this._onLoginSuccess();
    }
  }

  _onLoginSuccess() {
    const {state} = this.props.location;
    if (state && state.nextPathname) {
      this.context.history.replaceState(null, state.nextPathname);
    } else {
      this.context.history.replaceState(null, '/browse');
    }
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
                type="email"
                value={this.state.email}
                placeholder="Email"
                onChange={::this._onEmailChanged} />
            <input
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={::this._onPasswordChanged} />
              <button className="login" onClick={::this._onLogin}>Login</button>
          </form>
          <button className="facebook"
              onClick={::this._onLoginWithFacebook}>
            Sign in with Facebook
          </button>
          <button
              onClick={::this._onRegister}
              className="register">
            Register with Email
          </button>
          <a className="forgot" href="/">I forgot my password</a>
        </div>
      </div>
    );
  }
}
