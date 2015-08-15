import React, {Component} from 'react';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';

export default class RegisterHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static showNavBar() {
    return true;
  }

  state = {
    email: '',
    password: '',
    name: '',
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
      <div id="register-handler" className="login-common">
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
            <input
              type="text"
              value={this.state.name}
              placeholder="Name"
              onChange={::this._onNameChanged} />
            <button className="register" onClick={::this._register}>Register</button>
          </form>
          <button className="back" onClick={::this._back}>Back</button>
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

  _onNameChanged(event) {
    this.setState({
      name: event.target.value,
    });
  }

  _onSubmit(event) {
    event.preventDefault();
    this._register();
  }

  _register() {
    UserActions.register({
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
    });
  }

  _back() {
    this.context.router.goBack();
  }

  _onUserChanged(user) {
    if(user) {
      let {state} = this.props.location;
      if (state && state.nextPathname) {
        this.context.router.replaceWith(state.nextPathname);
      } else {
        this.context.router.replaceWith('/nelp');
      }
    }
  }
}
