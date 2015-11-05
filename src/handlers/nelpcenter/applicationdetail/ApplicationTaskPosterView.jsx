import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';

import IntlUtils from 'utils/IntlUtils';

import styles from './ApplicationTaskPosterView.scss';

@cssModules(styles)
class ApplicationTaskPosterView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
    onOpenChat: PropTypes.func,
    onViewProfile: PropTypes.func,
  }

  render() {
    const {application} = this.props;
    const task = application.task;
    const accepted = application.state === 'ACCEPTED';

    return (
      <div styleName="task-poster-section" className="panel">
        <div styleName="task-poster-profile-row">
          <Link styleName="task-poster-profile" to={`/center/applications/detail/${application.id}/profile`}>
            <div
              styleName="task-poster-picture"
              style={{backgroundImage: `url('${task.user.pictureURL}')`}}
            >
              <div styleName="task-poster-picture-overlay">
                <div styleName="task-poster-picture-icon" />
                <div styleName="task-poster-picture-text">
                  <FormattedMessage id="common.viewProfile" />
                </div>
              </div>
            </div>
            <div styleName="task-poster-name">{task.user.name}</div>
          </Link>
          <div styleName="task-poster-chat">
            <div styleName="task-poster-chat-icon" />
            <button styleName="task-poster-chat-btn" className="border-btn primary" onClick={this.props.onOpenChat}>
              <FormattedMessage id="nelpcenter.applicationDetail.chat" />
            </button>
          </div>
        </div>
        {
          accepted ?
          <div styleName="task-poster-contact">
            <div styleName="task-poster-contact-email">
              <div styleName="task-poster-contact-email-icon" />
              <a href={'mailto:' + task.userPrivate.email}>
                {task.userPrivate.email}
              </a>
            </div>
            {
              task.userPrivate.phone ?
              <div styleName="task-poster-contact-phone">
                <div styleName="task-poster-contact-phone-icon" />
                <div>
                  {IntlUtils.formatPhoneNumber(task.userPrivate.phone)}
                </div>
              </div> :
              null
            }
          </div> :
          null
        }
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationTaskPosterView, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        id,
        state,
        task {
          user {
            name,
            pictureURL,
          },
          userPrivate {
            phone,
            email,
          },
        },
      }
    `,
  },
});
