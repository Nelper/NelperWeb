import alt from 'app/alt';
import LayerUtils from 'utils/LayerUtils';

class ChatActions {

  constructor() {
    this.generateActions(
      'ready',
      'receivedMessages'
    );
  }

  init() {
    LayerUtils.init().then(() => this.actions.ready);
  }

  listMessages(convoUrl) {
    LayerUtils.getMessages(convoUrl)
      .then(messages => this.actions.receivedMessages(messages));
  }
}

export default alt.createActions(ChatActions);
