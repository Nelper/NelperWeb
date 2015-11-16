import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedRelative} from 'react-intl';

import PriceTag from 'components/PriceTag';
import IntlUtils from 'utils/IntlUtils';

import styles from './TaskSummaryView.scss';

@cssModules(styles)
class TaskSummaryView extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
  }

  state = {
    showProgressHelpDialog: false,
    showPaymentDialog: false,
    ratingText: '',
    rating: 0,
  }

  render() {
    const {task} = this.props;

    let statusIcon;
    let statusText;
    let price;
    let priceText;
    let date;
    let dateText;
    if (this.props.task.state === 'ACCEPTED') {
      price = task.acceptedApplication.price;
      priceText = <FormattedMessage id="nelpcenter.taskDetail.amount"/>;

      switch (this.props.task.completionState) {
      case 'PAYMENT_SENT':
        statusIcon = require('images/status/payment-sent.png');
        statusText = <FormattedMessage id="nelpcenter.myTasks.paymentSent"/>;
        dateText = <FormattedMessage id="nelpcenter.taskDetail.sent"/>;
        date = task.paymentSentAt;
        break;
      case 'COMPLETED':
        statusIcon = require('images/status/payment-released.png');
        statusText = <FormattedMessage id="nelpcenter.myTasks.paymentReleased"/>;
        dateText = <FormattedMessage id="nelpcenter.taskDetail.released"/>;
        date = task.paymentReleasedAt;
        break;
      case 'PAYMENT_REQUESTED':
        statusIcon = require('images/status/payment-request.png');
        statusText = <FormattedMessage id="nelpcenter.myTasks.paymentRequested"/>;
        date = task.paymentRequestedAt;
        dateText = <FormattedMessage id="nelpcenter.taskDetail.requested"/>;
        break;
      case 'ACCEPTED':
      default:
        statusIcon = require('images/icons/accepted.png');
        statusText = <FormattedMessage id="nelpcenter.myTasks.nelperAccepted"/>;
        priceText = <FormattedMessage id="nelpcenter.taskDetail.agreedPrice"/>;
        date = task.acceptedApplication.acceptedAt;
        dateText = <FormattedMessage id="nelpcenter.taskDetail.accepted"/>;
        break;
      }
    } else if (this.props.task.state === 'COMPLETED') {
      statusIcon = require('images/icons/accepted.png');
      statusText = <FormattedMessage id="nelpcenter.myTasks.completed"/>;
      price = task.acceptedApplication.price;
      priceText = <FormattedMessage id="nelpcenter.taskDetail.amount"/>;
      date = new Date();
      dateText = 'IDK';
    } else {
      statusIcon = require('images/icons/applicants.png');
      statusText = (
        <FormattedMessage id="nelpcenter.common.nelperCount" values={{
          num: task.applications.pendingCount,
        }}/>
      );
      price = task.priceOffered;
      priceText = <FormattedMessage id="nelpcenter.taskDetail.offer"/>;
      dateText = <FormattedMessage id="nelpcenter.taskDetail.posted"/>;
      date = task.createdAt;
    }

    return (
      <div styleName="task-summary" className="panel">
        <div styleName="summary-item">
          <div styleName="summary-title">
            <FormattedMessage id="nelpcenter.taskDetail.status" />
          </div>
          <div styleName="summary-content">
            <div styleName="summary-icon" style={{backgroundImage: `url('${statusIcon}')`}} />
            <div styleName="summary-text">
              {statusText}
            </div>
          </div>
        </div>
        <div styleName="summary-item">
          <div styleName="summary-title">
            {priceText}
          </div>
          <div styleName="summary-content">
            <PriceTag price={price} />
          </div>
        </div>
        <div styleName="summary-item">
          <div styleName="summary-title">
            {dateText}
          </div>
          <div styleName="summary-content">
            <div styleName="summary-icon" style={{backgroundImage: `url('${require('images/icons/calendar.png')}')`}} />
            <div styleName="summary-text">
              <FormattedRelative value={date}>
                {IntlUtils.upper}
              </FormattedRelative>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(TaskSummaryView, {
  fragments: {
    task: () => Relay.QL`
      fragment on Task {
        createdAt,
        paymentSentAt,
        paymentRequestedAt,
        paymentReleasedAt,
        state,
        completionState,
        priceOffered,
        acceptedApplication {
          acceptedAt,
          price,
        },
        applications {
          pendingCount,
        }
      }
    `,
  },
});
