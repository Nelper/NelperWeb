import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import moment from 'moment';

import Progress from 'components/Progress';
import ApplicationActions from 'actions/ApplicationActions';
import ApplicationStore from 'stores/ApplicationStore';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

@connectToStores
export default class ApplicationDetailHandler extends Component {

  static displayName = 'Application detail'

  static propTypes = {
    application: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [ApplicationStore];
  }

  static getPropsFromStores(props) {
    const applications = ApplicationStore.getState().applications;
    const application = applications.find(a => a.objectId === props.params.id);
    if (!application) {
      if (__CLIENT__) {
        ApplicationActions.refreshMyApplications();
      }

      return {
        application: null,
        isLoading: true,
      };
    }

    return {
      application,
      isLoading: false,
    };
  }

  render() {
    const {application, isLoading} = this.props;
    if (isLoading) {
      return (
        <div className="progress-center">
          <Progress />
        </div>
      );
    }
    const statusIcon = application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED ?
      require('images/icons/state-accepted.png') :
      require('images/icons/state-pending.png');

    const statusText = application.state === NELP_TASK_APPLICATION_STATE.ACCEPTED ?
      'Accepted' :
      'Pending';


    return (
      <div className="application-detail-handler container">
        <div className="panel application-summary">
          <div className="summary-item">
            <div className="summary-item-title">Application status</div>
            <div className="summary-item-status">
              <div className="summary-item-status-icon" style={{backgroundImage: `url('${statusIcon}')`}} />
              <div className="summary-item-status-text">{statusText}</div>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-item-title">Your offer</div>
            <div className="summary-item-price" />
          </div>
          <div className="summary-item">
            <div className="summary-item-title">Applied</div>
            <div className="summary-item-applied">
              <div className="summary-item-applied-icon" />
              <div className="summary-item-applied-text">{moment(application.createdAt).fromNow()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
