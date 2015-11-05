import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import {Rating} from 'components/index';
import UserProfileView from 'handlers/common/UserProfileView';

import styles from './ApplicationDetailProfileHandler.scss';

@cssModules(styles)
class ApplicationDetailProfileHandler extends Component {

  static propTypes = {
    application: PropTypes.object,
  }

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  render() {
    const {application} = this.props;
    const user = application.user;

    return (
      <div styleName="module" className="container">
        <div className="header-panel" styleName="header" >
          <div styleName="header-profile">
            <div
              styleName="picture"
              style={{backgroundImage: `url('${user.pictureURL}')`}}
            />
            <div styleName="info-container">
              <div styleName="user-name">
                {user.name}
              </div>
              <Rating rating={user.rating} number={user.tasksCompleted} />
            </div>
          </div>
        </div>
        <UserProfileView user={user} />
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationDetailProfileHandler, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        user {
          name,
          rating,
          pictureURL,
          ${UserProfileView.getFragment('user')},
        }
      }
    `,
  },
});
