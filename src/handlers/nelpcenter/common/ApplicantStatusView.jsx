import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import styles from './ApplicantStatusView.scss';

@cssModules(styles)
class ApplicationSummaryView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
  }

  render() {
    const {
      application,
      ...others,
    } = this.props;
    const applicationState = this.props.application.state;
    const {completionState} = this.props.application.task;
    let icon;
    let text;
    if (applicationState === 'ACCEPTED') {
      switch (completionState) {
      case 'PAYMENT_SENT':
        icon = require('images/status/payment-sent.png');
        text = <FormattedMessage id="nelpcenter.myTasks.paymentSent"/>;
        break;
      case 'PAYMENT_REQUESTED':
        icon = require('images/status/payment-request.png');
        text = <FormattedMessage id="nelpcenter.myTasks.paymentRequested"/>;
        break;
      case 'COMPLETED':
        icon = require('images/status/payment-released.png');
        text = <FormattedMessage id="nelpcenter.myTasks.paymentReleased"/>;
        break;
      case 'ACCEPTED':
      default:
        icon = require('images/icons/accepted.png');
        text = <FormattedMessage id="nelpcenter.myApplications.accepted"/>;
        break;
      }
    } else if (applicationState === 'DENIED') {
      icon = require('images/icons/state-pending.png');
      text = <FormattedMessage id="nelpcenter.myApplications.denied" />;
    } else if (applicationState === 'COMPLETED') {
      icon = require('images/icons/accepted.png');
      text = <FormattedMessage id="nelpcenter.myTasks.completed" />;
    } else {
      icon = require('images/icons/state-pending.png');
      text = <FormattedMessage id="nelpcenter.myApplications.pending" />;
    }

    return (
      <div styleName="status" {...others}>
        <div styleName="status-icon" style={{backgroundImage: `url('${icon}')`}} />
        <div>{text}</div>
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationSummaryView, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        state,
        task {
          completionState,
        },
      }
    `,
  },
});
