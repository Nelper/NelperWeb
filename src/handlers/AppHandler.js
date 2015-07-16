import React, {Component} from 'react';

import NavBar from 'components/NavBar';

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
    height: '100%',
  },
};
