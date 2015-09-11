import alt from 'app/alt';
import ChatActions from 'actions/ChatActions';

class ChatStore {

  state = {
    ready: false,
  }

  constructor() {
    this.bindListeners({
      handleReady: ChatActions.READY,
      handleReceivedMessages: ChatActions.RECEIVED_MESSAGES,
    });
  }

  handleReady() {
    this.setState({
      ready: true,
    });
  }

  handleReceivedMessages() {

  }
}

export default alt.createStore(ChatStore, 'ChatStore');
