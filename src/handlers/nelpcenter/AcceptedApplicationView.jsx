import React, {Component, PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';

import IconButton from 'components/IconButton';
import TaskProgress from './TaskProgress';

export default class TaskCardView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
  }

  state = {
    showProgressHelpDialog: false,
  }

  _onShowProgressHelp() {
    this.setState({showProgressHelpDialog: true});
  }

  render() {
    return (
      <div className="accepted-application-view">
        <div className="panel">
          <IconButton
            className="task-progress-help"
            icon={require('images/icons/help.svg')}
            onClick={::this._onShowProgressHelp}
          />
          <TaskProgress step={1} steps={[
            {title: <FormattedMessage id="nelpcenter.applicationDetail.progressAccepted" />},
            {title: <FormattedMessage id="nelpcenter.applicationDetail.progressSent" />},
            {title: <FormattedMessage id="nelpcenter.applicationDetail.progressPayment" />},
            {title: <FormattedMessage id="nelpcenter.applicationDetail.progressReleased" />},
          ]} />
          <div className="nelper-pay-separator">
            <div className="nelper-pay-icon" />
          </div>
          <div className="proceed-to-payment-btn">
            <button className="primary">
              <FormattedMessage id="nelpcenter.acceptedApplicationView.proceedPayment"/>
            </button>
          </div>

        </div>
        <div className="panel">

        </div>
      </div>
    );
  }
}
