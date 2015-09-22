import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import styles from './SettingsHandler.scss';

@cssModules(styles)
class AccountSettingsHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  render() {
    const {user} = this.props;

    return (
      <div className="settings-handler container">
        <div className="panel pad-all">
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
