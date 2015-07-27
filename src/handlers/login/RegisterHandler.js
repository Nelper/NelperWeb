import React, {Component} from 'react';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';

export default class RegisterHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static showNavBar() {
    return false;
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
      <div className="container pad-all">
        <h2>Register</h2>
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
        <div className="btn-group">
          <button className="primary" onClick={::this._register}>Register</button>
          <button onClick={::this._back}>Back</button>
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

  _register() {
    UserActions.register(this.state.email, this.state.password, this.state.name);
  }

  _back() {
    this.context.router.goBack();
  }

  _onUserChanged(user) {
    if(user) {
      this.context.router.replaceWith('/nelp');
    }
  }
}
