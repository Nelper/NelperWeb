import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import UserStore from 'stores/UserStore';
import NavBar from 'components/NavBar';

@connectToStores
export default class AppHandler extends Component {

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
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
