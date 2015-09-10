import {Component, PropTypes} from 'react';

import UserActions from 'actions/UserActions';

export default class LogoutHandler extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  componentDidMount() {
    UserActions.logout();
    this.context.router.transitionTo('/');
  }

  render() {
    return null;
  }
}
