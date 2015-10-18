import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import {Rating, PriceTag} from 'components/index';
import ChatDialogView from '../common/ChatDialogView';
import UserProfileView from 'handlers/common/UserProfileView';

import styles from './TaskApplicationDetailHandler.scss';

@cssModules(styles)
class TaskApplicationDetailHandler extends Component {

  static propTypes = {
    application: PropTypes.object,
  }

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  state = {
    showChatDialog: false,
  }

  _onOpenChat() {
    this.setState({showChatDialog: true});
  }

  _onCloseChat() {
    this.setState({showChatDialog: false});
  }

  render() {
    const {application} = this.props;
    const user = application.user;

    return (
      <div styleName="module" className="container">
        <ChatDialogView
          user={user}
          opened={this.state.showChatDialog}
          onClose={::this._onCloseChat}
        />
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
          <div styleName="header-asking-for">
            Asking for
            <PriceTag inverse price={application.price} />
          </div>
          <div styleName="chat">
            <div styleName="chat-icon" />
            <button className="border-btn inverse" onClick={::this._onOpenChat}>Open Chat</button>
          </div>
        </div>
        <UserProfileView user={user} />
      </div>
    );
  }
}

export default Relay.createContainer(TaskApplicationDetailHandler, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        price,
        user {
          objectId,
          name,
          pictureURL,
          about,
          rating,
          tasksCompleted,
          ${UserProfileView.getFragment('user')},
        }
      }
    `,
  },
});
