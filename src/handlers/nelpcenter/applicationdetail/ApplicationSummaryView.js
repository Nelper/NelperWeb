import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedRelative} from 'react-intl';

import PriceTag from 'components/PriceTag';
import ApplicantStatusView from '../common/ApplicantStatusView';
import IntlUtils from 'utils/IntlUtils';

import styles from './ApplicationSummaryView.scss';

@cssModules(styles)
class ApplicationSummaryView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
  };

  render() {
    const {application} = this.props;
    const task = application.task;

    const accepted = application.state === 'ACCEPTED';

    let priceTagTitle;
    let calendarTitle;
    let calendarValue;
    if (accepted) {
      switch (task.completionState) {
      case 'PAYMENT_SENT':
        priceTagTitle = <FormattedMessage id="nelpcenter.applicationDetail.amount" />;
        calendarTitle = <FormattedMessage id="nelpcenter.applicationDetail.sent" />;
        calendarValue = task.paymentSentAt;
        break;
      case 'PAYMENT_REQUESTED':
        priceTagTitle = <FormattedMessage id="nelpcenter.applicationDetail.amount" />;
        calendarTitle = <FormattedMessage id="nelpcenter.applicationDetail.requested" />;
        calendarValue = new Date();
        break;
      case 'COMPLETED':
        priceTagTitle = <FormattedMessage id="nelpcenter.applicationDetail.amount" />;
        calendarTitle = <FormattedMessage id="nelpcenter.applicationDetail.initiated" />;
        calendarValue = new Date();
        break;
      case 'ACCEPTED':
      default:
        priceTagTitle = <FormattedMessage id="nelpcenter.applicationDetail.agreed" />;
        calendarTitle = <FormattedMessage id="common.accepted" />;
        calendarValue = application.acceptedAt;
        break;
      }
    } else {
      priceTagTitle = <FormattedMessage id="nelpcenter.applicationDetail.offer" />;
      calendarTitle = <FormattedMessage id="common.applied" />;
      calendarValue = application.createdAt;
    }


    return (
      <div styleName="application-summary" className="panel">
        <div styleName="summary-item">
          <div styleName="summary-item-title">
            <FormattedMessage id="nelpcenter.applicationDetail.status" />
          </div>
          <ApplicantStatusView application={application} />
        </div>
        <div styleName="summary-item">
          <div styleName="summary-item-title">
            {priceTagTitle}
          </div>
          <PriceTag price={application.price} />
        </div>
        <div styleName="summary-item">
          <div styleName="summary-item-title">
            {calendarTitle}
          </div>
          <div styleName="summary-item-applied">
            <div styleName="summary-item-applied-icon" />
            <div>
              <FormattedRelative value={calendarValue}>
                {IntlUtils.upper}
              </FormattedRelative>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationSummaryView, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        createdAt,
        acceptedAt,
        state,
        price,
        task {
          completionState,
          paymentSentAt,
        },
        ${ApplicantStatusView.getFragment('application')},
      }
    `,
  },
});
