import {Component, PropTypes} from 'react';

import UserActions from 'actions/UserActions';

export default class LogoutHandler extends Component {

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
    UserActions.logout();
    this.context.history.pushState(null, '/');
  }

  render() {
    return null;
  }
}
