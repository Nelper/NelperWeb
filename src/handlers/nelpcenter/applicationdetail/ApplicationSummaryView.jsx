import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedRelative, FormattedNumber} from 'react-intl';

import ApplicantStatusView from '../common/ApplicantStatusView';
import IntlUtils from 'utils/IntlUtils';

import styles from './ApplicationSummaryView.scss';

@cssModules(styles)
class ApplicationSummaryView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
  }

  render() {
    const {application} = this.props;

    const accepted = application.state === 'ACCEPTED';

    return (
      <div styleName="application-summary" className="panel">
        <div styleName="summary-item">
          <div styleName="summary-item-title">
            {
              application.task.completionState !== 'ACCEPTED' ?
              <FormattedMessage id="nelpcenter.applicationDetail.taskStatus" /> :
              <FormattedMessage id="nelpcenter.applicationDetail.applicationStatus" />
            }
          </div>
          <ApplicantStatusView application={application} />
        </div>
        <div styleName="summary-item">
          <div styleName="summary-item-title">
            {
              accepted ?
              <FormattedMessage id="nelpcenter.applicationDetail.agreed" /> :
              <FormattedMessage id="nelpcenter.applicationDetail.offer" />
            }
          </div>
          <div styleName="summary-item-price">
            <FormattedNumber value={application.price} format="priceTag" />
          </div>
        </div>
        <div styleName="summary-item">
          <div styleName="summary-item-title">
            {accepted ? <FormattedMessage id="common.accepted" /> : <FormattedMessage id="common.applied" />}
          </div>
          <div styleName="summary-item-applied">
            <div styleName="summary-item-applied-icon" />
            <div>
              {
                accepted ?
                <FormattedRelative value={application.acceptedAt || new Date()}>
                  {IntlUtils.upper}
                </FormattedRelative> :
                <FormattedRelative value={application.createdAt}>
                  {IntlUtils.upper}
                </FormattedRelative>
              }
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
        },
        ${ApplicantStatusView.getFragment('application')},
      }
    `,
  },
});
