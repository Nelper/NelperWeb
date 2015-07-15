import React, {Component} from 'react';

export default class RegisterHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    email: '',
    password: '',
  }

  render() {
    return (
      <div className="container">
        <h2>Register</h2>
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

  _registerSuccess() {
    if (location.state && location.state.nextPathname) {
      this.context.router.replaceWith(location.state.nextPathname);
    } else {
      this.context.router.replaceWith('/nelp');
    }
  }
}
