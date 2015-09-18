import alt from 'app/alt';
import ChatActions from 'actions/ChatActions';

class ChatStore {

  state = {
    ready: false,
    convos: {},
  }

  constructor() {
    this.bindListeners({
      handleReady: ChatActions.READY,
      handleReceivedMessages: ChatActions.RECEIVED_MESSAGES,
      handleReceivedMessage: ChatActions.RECEIVED_MESSAGE,
    });
  }

  handleReady() {
    this.setState({
      ready: true,
    });
  }

  handleReceivedMessages({user, messages}) {
    const {convos} = this.state;
    convos[user.objectId] = messages;
    this.setState({convos});
  }

  handleReceivedMessage({userId, message}) {
    const {convos} = this.state;
    if (!convos[userId]) {
      convos[userId] = [];
    }

    convos[userId].unshift(message);
    this.setState({convos});
  }
}

export default alt.createStore(ChatStore, 'ChatStore');
