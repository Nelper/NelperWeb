import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import styles from './TransactionHistoryHandler.scss';

@cssModules(styles)
class TransactionHistoryHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  };

  render() {
    return (
      <div className="settings-handler container">
        <div className="panel">
          <div className="panel-title">
            <h2><FormattedMessage id="settings.history.title" /></h2>
          </div>
          <div className="panel-content"></div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(TransactionHistoryHandler, {
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
