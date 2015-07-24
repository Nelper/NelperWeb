import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import classNames from 'classnames';

import UserStore from 'stores/UserStore';
import UserActions from 'actions/UserActions';
import NavBar from 'components/NavBar';

@connectToStores
export default class AppHandler extends Component {

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  componentDidMount() {
    // If the user is logged in update its info from the server.
    if(this.props.user) {
      UserActions.update();
    }
  }

  render() {
    let {children, user} = this.props;
    let showNavBar = !children.type.showNavBar || children.type.showNavBar();
    return (
      <div style={styles.app}>
        {
          showNavBar ?
          <NavBar user={user} /> :
          null
        }
        <div id="app-content" className={classNames({'has-navbar': showNavBar})}>
          {children}
        </div>
      </div>
    );
  }
}

const styles = {
  app: {
    height: '100%',
  },
};
