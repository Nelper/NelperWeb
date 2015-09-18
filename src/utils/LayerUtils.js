import {Parse} from 'parse';

import LogUtils from 'utils/LogUtils';

class LayerUtils {
  _headers = {
    Accept: 'application/vnd.layer+json; version=1.0',
    'Content-Type': 'application/json',
  }

  _layerUrl = 'https://api.layer.com'

  _appId = '33a90a5e-5006-11e5-a708-7f0c79166812'

  _convos = {}

  _onMessageListener = () => {}

  init() {
    return this.getNonce()
      .then(nonce => this.getIdentityToken(nonce))
      .then(token => this.getSession(token))
      .then(session => {
        if (session) {
          this._headers.Authorization = `Layer session-token="${session}"`;
        }
        return session;
      })
      .then(session => {
        // TODO: Fallback to xhr pooling if the browser doesn't support websockets.
        if (!window.WebSocket) {
          return;
        }
        const ws = new WebSocket(`wss://api.layer.com/websocket?session_token=${session}`,
          'com.layer.notifications-1.0');

        ws.onmessage = (event) => {
          this._handleWebsocketPacket(JSON.parse(event.data));
        };
      });
  }

  getNonce() {
    return fetch(this._layerUrl + '/nonces', {
      method: 'post',
      headers: this._headers,
    })
    .then(res => res.json())
    .then(res => res.nonce);
  }

  getIdentityToken(nonce) {
    return Parse.Cloud.run('generateToken', {nonce});
  }

  getSession(identityToken) {
    return fetch(this._layerUrl + '/sessions', {
      method: 'post',
      headers: this._headers,
      body: JSON.stringify({
        identity_token: identityToken,
        app_id: this._appId,
      }),
    })
    .then(res => res.json())
    .then(res => res.session_token);
  }

  getConversations() {
    return fetch(this._layerUrl + '/conversations', {
      method: 'get',
      headers: this._headers,
    })
    .then(res => res.json());
  }

  createConversation(participants) {
    return fetch(this._layerUrl + '/conversations', {
      method: 'post',
      headers: this._headers,
      body: JSON.stringify({
        participants: participants,
        distinct: true,
      }),
    })
    .then(res => res.json());
  }

  getMessages(user) {
    const queryMessages = (url) => {
      return fetch(url + '/messages', {
        method: 'get',
        headers: this._headers,
      })
      .then(res => res.json())
      .then(messages => {
        return messages.map(m => {
          return this._convertTextMessage(m);
        });
      });
    };

    const conversationUrl = this._convos[user.objectId];
    if (!conversationUrl) {
      return this.getConversations()
        .then(convos => {
          let convo = convos.find(c => {
            return c.distinct && c.participants.indexOf(user.objectId) >= 0;
          });

          if (!convo) {
            convo = convos.find(c => {
              return c.participants.indexOf(user.objectId) >= 0;
            });
          }

          if (!convo) {
            return this.createConversation([user.objectId]);
          }
          return convo;
        })
        .then(convo => {
          this._convos[user.objectId] = convo;
          return queryMessages(convo.url);
        });
    }

    return queryMessages(conversationUrl);
  }

  sendMessage(user, message) {
    const conversationUrl = this._convos[user.objectId].url;
    return fetch(conversationUrl + '/messages', {
      method: 'post',
      headers: this._headers,
      body: JSON.stringify({
        parts: [{
          body: message,
          mime_type: 'text/plain',
        }],
      }),
    })
    .then(res => res.json())
    .then(m => this._convertTextMessage(m));
  }

  setOnMessageListener(listener) {
    this._onMessageListener = listener;
  }

  _convertTextMessage(m) {
    return {
      objectId: m.id,
      author: m.sender.user_id,
      text: m.parts[0].body,
      createdAt: m.sent_at,
    };
  }

  _handleWebsocketPacket(packet) {
    switch (packet.type) {
    case 'change':
      const objType = packet.body.object.type;
      const objData = packet.body.data;
      if (objType === 'Message') {
        if (!Array.isArray(objData)) {
          const userId = Object.keys(objData.recipient_status)
            .find(r => r !== Parse.User.current().id);
          this._onMessageListener({userId, message: this._convertTextMessage(objData)});
        }
      }
      break;
    default:
      LogUtils.warn(`Unsupported packet type ${packet.type}`);
    }
  }
}

export default new LayerUtils();
