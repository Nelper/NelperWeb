import React, {Component, PropTypes} from 'react';

import ApiUtils from 'utils/ApiUtils';

export default class RegisterHandler extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
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

  _onFirstNameChanged(event) {
    this.setState({
      firstName: event.target.value,
    });
  }

  _onLastNameChanged(event) {
    this.setState({
      lastName: event.target.value,
    });
  }

  _onSubmit(event) {
    event.preventDefault();
    this._onRegister();
  }

  _onRegister() {
    ApiUtils.register({
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    }).then(() => {
      const {state} = this.props.location;
      if (state && state.nextPathname) {
        window.location = state.nextPathname;
      } else {
        window.location = '/browse';
      }
    });
  }

  _onBack() {
    this.context.history.goBack();
  }

  render() {
    return (
      <div id="register-handler" className="login-common">
        <div className="content">
          <img
            className="nelpy"
            src={require('images/logo-nobg-lg.png')}
          />
          <h2 className="title">Nelper</h2>
          <form onSubmit={::this._onSubmit}>
            <input
              type="email"
              value={this.state.email}
              placeholder="Email"
              onChange={::this._onEmailChanged}
            />
            <input
              type="password"
              value={this.state.password}
              placeholder="Password"
              onChange={::this._onPasswordChanged}
            />
            <input
              type="text"
              value={this.state.firstName}
              placeholder="First name"
              onChange={::this._onFirstNameChanged}
            />
            <input
              type="text"
              value={this.state.lastName}
              placeholder="Last name"
              onChange={::this._onLastNameChanged}
            />
            <button className="register" type="submit">Register</button>
          </form>
          <button className="back" onClick={::this._onBack}>Back</button>
        </div>
      </div>
    );
  }
}
