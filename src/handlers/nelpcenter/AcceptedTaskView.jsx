import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage, FormattedHTMLMessage, FormattedNumber, FormattedDate} from 'react-intl';

import Dialog from 'components/Dialog';
import IconButton from 'components/IconButton';
import TaskProgress from './TaskProgress';
import TaskPaymentDialogView from './TaskPaymentDialogView';
import IntlUtils from 'utils/IntlUtils';

class AcceptedTaskView extends Component {

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  static propTypes = {
    task: PropTypes.object.isRequired,
  }

  state = {
    showProgressHelpDialog: false,
    showPaymentDialog: false,
  }

  _onShowProgressHelp() {
    this.setState({showProgressHelpDialog: true});
  }

  _onShowProgressHelpClose() {
    this.setState({
      showProgressHelpDialog: false,
    });
  }

  _onPosterProfileClick() {
    const {task} = this.props;
    this.context.history.pushState(null, `/center/tasks/detail/${task.id}/${task.acceptedApplication.id}`);
  }

  _onProceedToPayment() {
    this.setState({showPaymentDialog: true});
  }

  _onPaymentDialogClose() {
    this.setState({showPaymentDialog: false});
  }

  _onPaymentSuccess() {

  }

  _onTaskCompleted() {

  }

  _getTaskStep() {
    switch (this.props.task.completionState) {
    case 'PAYMENT_SENT':
      return 1;
    case 'COMPLETED':
      return 2;
    case 'RATED':
      return 3;
    case 'ACCEPTED':
    default:
      return 0;
    }
  }

  _renderTaskCompletion() {
    const {task} = this.props;
    const application = task.acceptedApplication;
    switch (task.completionState) {
    case 'PAYMENT_SENT':
      return (
        <div className="payment-sent-container">
          <div className="paid-amount">
            <FormattedNumber value={application.price} style="currency" currency="CAD" />
          </div>
          <div className="paid-on">
            <FormattedMessage id="nelpcenter.acceptedTaskView.paidOn" values={{
              date: <FormattedDate value={new Date()} />,
            }} />
          </div>
          <button className="primary" onClick={::this._onTaskCompleted}>
            <FormattedMessage id="nelpcenter.acceptedTaskView.taskCompleted" values={{name: application.user.name}} />
          </button>
        </div>
      );
    case 'COMPLETED':
      return 2;
    case 'RATED':
      return 3;
    case 'ACCEPTED':
    default:
      return (
        <div className="proceed-payment-container">
          <button className="primary" onClick={::this._onProceedToPayment}>
            <FormattedMessage id="nelpcenter.acceptedTaskView.proceedPayment" />
          </button>
          <div className="about-nelper-pay">
            <IconButton
              className="task-progress-help"
              icon={require('images/icons/help.svg')}
            />
            <FormattedMessage id="nelpcenter.acceptedTaskView.aboutNelperPay" />
          </div>
        </div>
      );
    }
  }

  render() {
    const {task} = this.props;
    const application = task.acceptedApplication;

    return (
      <div className="accepted-application-view">
        <TaskPaymentDialogView
          task={task}
          opened={this.state.showPaymentDialog}
          onClose={::this._onPaymentDialogClose}
          onSuccess={::this._onPaymentSuccess}
        />
        <Dialog opened={this.state.showProgressHelpDialog} onClose={::this._onShowProgressHelpClose}>
          <div className="dialog-content">
            <FormattedHTMLMessage id="nelpcenter.taskDetail.progressHelp" />
          </div>
          <div className="dialog-buttons">
            <button onClick={::this._onShowProgressHelpClose}>Close</button>
          </div>
        </Dialog>
        <div className="panel">
          <IconButton
            className="task-progress-help"
            icon={require('images/icons/help.svg')}
            onClick={::this._onShowProgressHelp}
          />
          <TaskProgress step={this._getTaskStep()} steps={[
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressAccepted" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressSent" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressApproved" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressRating" />},
          ]} />
          <div className="nelper-pay-separator">
            <div className="nelper-pay-icon" />
          </div>
          {
            this._renderTaskCompletion()
          }
        </div>
        <div className="panel task-poster-section">
          <div className="task-poster-profile-row">
            <div className="task-poster-profile" onClick={::this._onPosterProfileClick}>
              <div
                className="task-poster-picture"
                style={{backgroundImage: `url('${application.user.pictureURL}')`}}
              >
                <div className="task-poster-picture-overlay">
                  <div className="task-poster-picture-icon" />
                  <div className="task-poster-picture-text">
                    <FormattedMessage id="common.viewProfile" />
                  </div>
                </div>
              </div>
              <div className="task-poster-name">{application.user.name}</div>
            </div>
            <div className="task-poster-chat">
              <div className="task-poster-chat-icon" />
              <button className="border-btn primary task-poster-chat-btn">
                <FormattedMessage id="nelpcenter.acceptedTaskView.chat" />
              </button>
            </div>
          </div>
          <div className="task-poster-contact">
            <div className="task-poster-contact-email">
              <div className="task-poster-contact-email-icon" />
              <div className="task-poster-contact-email-text">
                <a href={'mailto:' + application.email}>{application.email}</a>
              </div>
            </div>
            {
              application.phone ?
              <div className="task-poster-contact-phone">
                <div className="task-poster-contact-phone-icon" />
                <div className="task-poster-contact-phone-text">
                  {IntlUtils.formatPhoneNumber(application.phone)}
                </div>
              </div> :
              null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(AcceptedTaskView, {
  fragments: {
    task: () => Relay.QL`
      fragment on Task {
        id,
        completionState,
        acceptedApplication {
          id,
          email,
          phone,
          price,
          user {
            name,
            pictureURL,
          },
        },
      }
    `,
  },
});
