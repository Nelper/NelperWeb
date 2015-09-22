import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import styles from './NotificationsSettingsHandler.scss';

@cssModules(styles)
class NotificationsSettingsHandler extends Component {

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

export default Relay.createContainer(NotificationsSettingsHandler, {
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
