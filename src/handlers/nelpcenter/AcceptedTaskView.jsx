import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage, FormattedHTMLMessage, FormattedNumber, FormattedDate} from 'react-intl';

import CompleteTaskMutation from 'actions/nelpcenter/CompleteTaskMutation';
import SendApplicantFeedbackMutation from 'actions/nelpcenter/SendApplicantFeedbackMutation';
import {Rating, IconButton, Dialog} from 'components/index';
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
    ratingText: '',
    rating: 0,
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
    this.setState({showPaymentDialog: false});
  }

  _onTaskCompleted() {
    Relay.Store.update(
      new CompleteTaskMutation({
        task: this.props.task,
      }),
    );
  }

  _onRatingTextChange(event) {
    this.setState({ratingText: event.target.value});
  }

  _onRatingChange(rating) {
    this.setState({rating});
  }

  _onSendRatingClick() {
    Relay.Store.update(
      new SendApplicantFeedbackMutation({
        task: this.props.task,
        content: this.state.ratingText,
        rating: this.state.rating,
      }),
    );
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
              date: <FormattedDate value={task.paymentSentAt} />,
            }} />
          </div>
          <button className="primary" onClick={::this._onTaskCompleted}>
            <FormattedMessage id="nelpcenter.acceptedTaskView.taskCompleted" values={{name: application.user.name}} />
          </button>
        </div>
      );
    case 'COMPLETED':
      return (
        <div>
          <h1>Review your nelper</h1>
          <Rating editable dark rating={this.state.rating} onChange={::this._onRatingChange} />
          <textarea value={this.state.ratingText} onChange={::this._onRatingTextChange} />
          <div className="btn-group">
            <button className="primary" onClick={::this._onSendRatingClick}>Send</button>
            <button>No thanks</button>
          </div>
        </div>
      );
    case 'RATED':
      return (
        <div>You are done gratz</div>
      );
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
        paymentSentAt,
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
        ${TaskPaymentDialogView.getFragment('task')},
        ${CompleteTaskMutation.getFragment('task')},
        ${SendApplicantFeedbackMutation.getFragment('task')},
      }
    `,
  },
});
