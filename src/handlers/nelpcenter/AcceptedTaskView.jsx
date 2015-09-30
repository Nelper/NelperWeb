import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import Dialog from 'components/Dialog';
import IconButton from 'components/IconButton';
import TaskProgress from './TaskProgress';
import TaskPaymentDialogView from './TaskPaymentDialogView';

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
    this.context.history.pushState(null, `/center/tasks/detail/${task.id}/${task.applications.accepted.id}`);
  }

  _onProceedToPayment() {
    this.setState({showPaymentDialog: true});
  }

  _onPaymentDialogClose() {
    this.setState({showPaymentDialog: false});
  }

  render() {
    const {task} = this.props;
    const application = task.applications.accepted;

    return (
      <div className="accepted-application-view">
        <TaskPaymentDialogView task={task} opened={this.state.showPaymentDialog} onClose={::this._onPaymentDialogClose}/>
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
          <TaskProgress step={0} steps={[
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressAccepted" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressSent" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressApproved" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressRating" />},
          ]} />
          <div className="nelper-pay-separator">
            <div className="nelper-pay-icon" />
          </div>
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
                {application.email}
              </div>
            </div>
            <div className="task-poster-contact-phone">
              <div className="task-poster-contact-phone-icon" />
              <div className="task-poster-contact-phone-text">
                {application.phone}
              </div>
            </div>
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
        applications {
          accepted {
            id,
            email,
            phone,
            price,
            user {
              name,
              pictureURL,
            },
          },
        },
      }
    `,
  },
});
