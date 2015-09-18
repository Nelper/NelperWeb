import alt from 'app/alt';
import LayerUtils from 'utils/LayerUtils';

class ChatActions {

  constructor() {
    this.generateActions(
      'ready',
      'receivedMessages',
      'receivedMessage',
    );
  }

  init() {
    LayerUtils.init().then(() => this.actions.ready());
    LayerUtils.setOnMessageListener((m) => {
      this.actions.receivedMessage(m);
    });
  }

  listMessages(user) {
    LayerUtils.getMessages(user)
      .then(messages => this.actions.receivedMessages({user, messages}));
  }

  sendMessage(user, message) {
    LayerUtils.sendMessage(user, message);
  }
}

export default alt.createActions(ChatActions);
