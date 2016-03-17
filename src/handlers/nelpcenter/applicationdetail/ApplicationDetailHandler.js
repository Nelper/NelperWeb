import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import CancelApplyForTaskMutation from 'actions/CancelApplyForTaskMutation';
import ChatDialogView from '../common/ChatDialogView';
import ApplicationSummaryView from './ApplicationSummaryView';
import ApplicationTaskProgressView from './ApplicationTaskProgressView';
import ApplicationTaskPosterView from './ApplicationTaskPosterView';
import ApplicationTaskDetailView from './ApplicationTaskDetailView';

import styles from './ApplicationDetailHandler.scss';

@cssModules(styles)
class ApplicationDetailHandler extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  state = {
    showChatDialog: false,
  };

  _onChatDialogOpen() {
    this.setState({showChatDialog: true});
  }

  _onChatDialogClose() {
    this.setState({showChatDialog: false});
  }

  _onCancelApply() {
    Relay.Store.update(
      new CancelApplyForTaskMutation({
        task: this.props.application.task,
        me: this.props.me,
      }),
    );
    this.context.router.pushState(null, '/center');
  }

  render() {
    const {application} = this.props;
    const task = application.task;
    const accepted = application.state === 'ACCEPTED';

    return (
      <div styleName="module" className="container">
        <ChatDialogView
          user={task.user}
          opened={this.state.showChatDialog}
          onClose={::this._onChatDialogClose}
        />
        <ApplicationSummaryView application={application} />
        {
          accepted ?
          <ApplicationTaskProgressView application={application} /> :
          null
        }
        <ApplicationTaskPosterView
          application={application}
          onOpenChat={::this._onChatDialogOpen}
        />
        <ApplicationTaskDetailView application={application} />
        {
          !accepted ?
          <div styleName="cancel-button-container">
            <button className="white-button" onClick={::this._onCancelApply}>
              <FormattedMessage id="common.cancelApply" />
            </button>
          </div> :
          null
        }
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationDetailHandler, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        state,
        task {
          user {
            objectId,
          },
          ${CancelApplyForTaskMutation.getFragment('task')},
        },
        ${ApplicationSummaryView.getFragment('application')},
        ${ApplicationTaskProgressView.getFragment('application')},
        ${ApplicationTaskPosterView.getFragment('application')},
        ${ApplicationTaskDetailView.getFragment('application')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${CancelApplyForTaskMutation.getFragment('me')}
      }
    `,
  },
});
