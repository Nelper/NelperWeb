import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

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
    return (
      <div style={styles.app}>
        <NavBar user={this.props.user} />
        <div id="app-content">
          {this.props.children}
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
