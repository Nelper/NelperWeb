import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import {Rating} from 'components/index';

import UserProfileView from '../common/UserProfileView';

import styles from './TaskPosterProfileHandler.scss';

@cssModules(styles)
class TaskPosterProfileHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  render() {
    const {user} = this.props;
    return (
      <div styleName="module" className="container">
        <div className="header-panel" styleName="profile-header">
          <div styleName="profile-picture" style={{backgroundImage: `url('${user.pictureURL}')`}} />
          <div>
            <div styleName="username">{user.name}</div>
            <div styleName="rating">
              <Rating rating={user.rating} number={user.tasksCompleted} />
            </div>
          </div>
        </div>
        <UserProfileView user={this.props.user} />
      </div>
    );
  }
}

export default Relay.createContainer(TaskPosterProfileHandler, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        name,
        pictureURL,
        rating,
        tasksCompleted,
        ${UserProfileView.getFragment('user')},
      }
    `,
  },
});
