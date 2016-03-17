import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import connectToStores from 'alt-utils/lib/connectToStores';

import ChatActions from 'actions/ChatActions';
import ChatStore from 'stores/ChatStore';
import {Dialog, Progress} from 'components/index';

import styles from './ChatDialogView.scss';

@connectToStores
@cssModules(styles)
export default class ChatDialogView extends Component {

  static propTypes = {
    user: PropTypes.object,
    messages: PropTypes.array,
    isLoading: PropTypes.bool,
    opened: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
  };

  static getStores() {
    return [ChatStore];
  }

  static getPropsFromStores(props) {
    if (!props.user) {
      return {
        isLoading: true,
      };
    }
    const state = ChatStore.getState();
    const messages = state.convos[props.user.objectId];
    if (__CLIENT__ && !messages && state.ready) {
      ChatActions.listMessages(props.user);
    }

    return {
      isLoading: !messages,
      messages,
    };
  }

  state = {
    message: '',
  };

  _shouldScrollBottom = true;
  _scrollTimeout = null;

  componentDidMount() {
    ChatActions.init();
  }

  componentWillUpdate() {
    // Check if we should scroll the message list to the bottom.
    const scrollArea = this.refs.scroll;
    if (scrollArea) {
      this._shouldScrollBottom = (scrollArea.scrollTop + scrollArea.offsetHeight) >= scrollArea.scrollHeight;
    }
  }

  componentDidUpdate() {
    // Scroll the message list to the bottom if needed.
    if (this._shouldScrollBottom) {
      this._scrollTimeout = setTimeout(() => {
        const scrollArea = this.refs.scroll;
        if (scrollArea) {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }
      }, 0);
    }
  }

  componentWillUnmount() {
    clearTimeout(this._scrollTimeout);
  }

  _onMessageChange(event) {
    if (event.defaultPrevented) {
      return;
    }
    this.setState({message: event.target.value});
  }

  _onInputKeyDown(event) {
    // Prevent the enter key from creating a new line.
    // The user must user shift + enter.
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
    }
  }

  _onInputKeyUp(event) {
    // Submit when enter key is pressed. Shift-enter will still change line.
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      this._onMessageSend();
    }
  }

  _onMessageSend() {
    // Check if the message is only whitespace.
    if (this.state.message.match(/^\s*$/)) {
      return;
    }
    ChatActions.sendMessage(this.props.user, this.state.message);
    this.setState({message: ''});
  }

  render() {
    const {messages, isLoading, user} = this.props;

    const displayedMessages = messages && messages
      .map((m, i) => {
        return (
          <div key={i} styleName={m.author === user.objectId ? 'message-other' : 'message-me'}>
            {m.text}
          </div>
        );
      })
      .reverse();

    return (
      <Dialog className="chat-dialog-view pad-all" opened={this.props.opened} onClose={this.props.onClose}>
        <div styleName="module">
          {
            isLoading ?
            <div className="progress-center"><Progress /></div> :
            <div styleName="dialog-container">
              <h2>Chat with {user.name}</h2>
              <div styleName="messages" ref="scroll">
                <div key="flex" styleName="flex" />
                {displayedMessages}
              </div>
              <div styleName="compose">
                <textarea
                  styleName="compose-input"
                  placeholder="Send a message..."
                  value={this.state.message}
                  onChange={::this._onMessageChange}
                  onKeyDown={::this._onInputKeyDown}
                  onKeyUp={::this._onInputKeyUp}
                />
                <button
                  className="primary"
                  styleName="compose-send"
                  onClick={::this._onMessageSend}
                >
                  Send
                </button>
              </div>
            </div>
          }
        </div>
      </Dialog>
    );
  }
}
