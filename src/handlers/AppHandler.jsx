import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import classNames from 'classnames';

import UserStore from 'stores/UserStore';
import UserActions from 'actions/UserActions';
import NavBar from 'components/NavBar';
import Breadcrumbs from 'components/Breadcrumbs';

@connectToStores
export default class AppHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
    children: PropTypes.node,
  }

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  componentDidMount() {
    // If the user is logged in update its info from the server.
    if (this.props.user.logged) {
      UserActions.update();
    }
  }

  render() {
    const {children, user} = this.props;
    const showNavBar = !children || !children.type.showNavBar || children.type.showNavBar();
    return (
      <div style={{
        height: '100%',
      }}>
        {
          showNavBar ?
          <NavBar user={user} /> :
          null
        }
        <div className={classNames('main-app-content', {'has-navbar': showNavBar})}>
          <div className="container">
            <Breadcrumbs />
          </div>
          {children}
        </div>
      </div>
    );
  }
}
