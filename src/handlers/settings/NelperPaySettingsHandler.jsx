import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import styles from './NelperPaySettingsHandler.scss';

@cssModules(styles)
class AccountSettingsHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  render() {
    return (
      <div className="settings-handler container">
        <div className="panel">
          <div className="panel-title">
            <h2>Credit cards</h2>
            <button className="link-button">Add new</button>
          </div>
          <div className="panel-content"></div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(AccountSettingsHandler, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        privateData {
          language,
        }
      }
    `,
  },
});
