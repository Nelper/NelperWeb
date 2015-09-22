import {Component, PropTypes} from 'react';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';

export default class LogoutHandler extends Component {

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.context.history.pushState(null, '/');
    if (UserStore.isLogged()) {
      UserActions.logout();
    }
  }

  render() {
    return null;
  }
}
