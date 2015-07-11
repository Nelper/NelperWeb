import React, {Component} from 'react';
import {RouteHandler} from 'react-router';

import NavBar from './NavBar';

export default class AppHandler extends Component {
  render() {
    return (
      <div style={styles.app}>
        <NavBar />
        <RouteHandler />
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
