import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import RequestPaymentMutation from 'actions/nelpcenter/RequestPaymentMutation';
import {Dialog, IconButton} from 'components/index';
import TaskProgress from '../common/TaskProgress';

import styles from './ApplicationTaskProgressView.scss';

@cssModules(styles)
class ApplicationTaskProgressView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
  };

  state = {
    showProgressHelpDialog: false,
  };

  _onShowProgressHelp() {
    this.setState({showProgressHelpDialog: true});
  }

  _onShowProgressHelpClose() {
    this.setState({showProgressHelpDialog: false});
  }

  _onRequestPayment() {
    Relay.Store.update(
      new RequestPaymentMutation({
        task: this.props.application.task,
      }),
    );
  }

  _getApplicationStep() {
    switch (this.props.application.task.completionState) {
    case 'PAYMENT_SENT':
      return 1;
    case 'PAYMENT_REQUESTED':
      return 2;
    case 'COMPLETED':
    case 'RATED':
      return 3;
    case 'ACCEPTED':
    default:
      return 0;
    }
  }

  render() {
    const {application} = this.props;
    const task = application.task;

    return (
      <div>
        <Dialog opened={this.state.showProgressHelpDialog} onClose={::this._onShowProgressHelpClose}>
          <div className="dialog-content">
            <FormattedHTMLMessage id="nelpcenter.applicationDetail.progressHelp" />
          </div>
          <div className="dialog-buttons">
            <button onClick={::this._onShowProgressHelpClose}>
              <FormattedMessage id="nelpcenter.common.close" />
            </button>
          </div>
        </Dialog>
        <div styleName="task-progress" className="panel">
          <IconButton
            styleName="task-progress-help"
            icon={require('images/icons/help.svg')}
            onClick={::this._onShowProgressHelp}
          />
          <TaskProgress step={this._getApplicationStep()} steps={[
            {title: <FormattedMessage id="nelpcenter.applicationDetail.progressAccepted" />},
            {title: <FormattedMessage id="nelpcenter.applicationDetail.progressSent" />},
            {title: <FormattedMessage id="nelpcenter.applicationDetail.progressPayment" />},
            {title: <FormattedMessage id="nelpcenter.applicationDetail.progressReleased" />},
          ]} />
          {
            task.completionState === 'PAYMENT_SENT' ?
            <div styleName="task-progress-btn-container">
              <button styleName="task-progress-completed-btn" className="primary" onClick={::this._onRequestPayment}>
                <FormattedMessage id="nelpcenter.applicationDetail.completed" />
              </button>
            </div> :
            null
          }
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationTaskProgressView, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        task {
          completionState,
          ${RequestPaymentMutation.getFragment('task')},
        },
      }
    `,
  },
});
