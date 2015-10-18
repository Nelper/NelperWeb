import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {Link} from 'react-router';
import {FormattedMessage, FormattedHTMLMessage, FormattedNumber, FormattedDate} from 'react-intl';

import CompleteTaskMutation from 'actions/nelpcenter/CompleteTaskMutation';
import SendApplicantFeedbackMutation from 'actions/nelpcenter/SendApplicantFeedbackMutation';
import {Rating, IconButton, Dialog} from 'components/index';
import TaskProgress from '../common/TaskProgress';
import TaskPaymentDialogView from './TaskPaymentDialogView';
import IntlUtils from 'utils/IntlUtils';

import styles from './AcceptedTaskView.scss';

@cssModules(styles)
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
        <div styleName="payment-sent-container">
          <div styleName="paid-amount">
            <FormattedNumber value={application.price} style="currency" currency="CAD" />
          </div>
          <div styleName="paid-on">
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
        <div styleName="proceed-payment-container">
          <button className="primary" onClick={::this._onProceedToPayment}>
            <FormattedMessage id="nelpcenter.acceptedTaskView.proceedPayment" />
          </button>
          <Link to="/nelperpay" styleName="about-nelper-pay">
            <FormattedMessage id="nelpcenter.acceptedTaskView.aboutNelperPay" />
          </Link>
        </div>
      );
    }
  }

  render() {
    const {task} = this.props;
    const application = task.acceptedApplication;

    return (
      <div styleName="accepted-application-view">
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
          <div styleName="nelper-pay-separator">
            <div styleName="nelper-pay-icon" />
          </div>
          {
            this._renderTaskCompletion()
          }
        </div>
        <div styleName="task-poster-section" className="panel">
          <div styleName="task-poster-profile-row">
            <div styleName="task-poster-profile" onClick={::this._onPosterProfileClick}>
              <div
                styleName="task-poster-picture"
                style={{backgroundImage: `url('${application.user.pictureURL}')`}}
              >
                <div styleName="task-poster-picture-overlay">
                  <div styleName="task-poster-picture-icon" />
                  <div styleName="task-poster-picture-text">
                    <FormattedMessage id="common.viewProfile" />
                  </div>
                </div>
              </div>
              <div styleName="task-poster-name">{application.user.name}</div>
            </div>
            <div styleName="task-poster-chat">
              <div styleName="task-poster-chat-icon" />
              <button styleName="task-poster-chat-btn" className="border-btn primary">
                <FormattedMessage id="nelpcenter.acceptedTaskView.chat" />
              </button>
            </div>
          </div>
          <div styleName="task-poster-contact">
            <div styleName="task-poster-contact-email">
              <div styleName="task-poster-contact-email-icon" />
              <div>
                <a href={'mailto:' + application.email}>{application.email}</a>
              </div>
            </div>
            {
              application.phone ?
              <div styleName="task-poster-contact-phone">
                <div styleName="task-poster-contact-phone-icon" />
                <div>
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
