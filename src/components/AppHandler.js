import React, {Component} from 'react';

import NavBar from './NavBar';

export default class AppHandler extends Component {
  render() {
    return (
      <div style={styles.app}>
        <NavBar />
        {this.props.children}
      </div>
    );
  }
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
};
