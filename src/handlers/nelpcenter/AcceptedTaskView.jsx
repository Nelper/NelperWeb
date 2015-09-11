import React, {Component, PropTypes} from 'react';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import Dialog from 'components/Dialog';
import IconButton from 'components/IconButton';
import TaskProgress from './TaskProgress';

export default class TaskCardView extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired,
  }

  state = {
    showProgressHelpDialog: false,
  }

  _onShowProgressHelp() {
    this.setState({showProgressHelpDialog: true});
  }

  _onShowProgressHelpClose() {
    this.setState({
      showProgressHelpDialog: false,
    });
  }

  render() {
    const {application} = this.props;

    return (
      <div className="accepted-application-view">
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
          <TaskProgress step={1} steps={[
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressAccepted" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressSent" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressApproved" />},
            {title: <FormattedMessage id="nelpcenter.taskDetail.progressRating" />},
          ]} />
          <div className="nelper-pay-separator">
            <div className="nelper-pay-icon" />
          </div>
          <div className="proceed-payment-container">
            <button className="primary">
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
            <div className="task-poster-profile">
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
              <button className="border-btn task-poster-chat-btn">
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
