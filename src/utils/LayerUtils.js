import {Parse} from 'parse';

class LayerUtils {
  _headers = {
    Accept: 'application/vnd.layer+json; version=1.0',
    'Content-Type': 'application/json',
  }

  _layerUrl = 'https://api.layer.com'

  _appId = '33a90a5e-5006-11e5-a708-7f0c79166812'

  init() {
    return this.getNonce()
      .then(nonce => this.getIdentityToken(nonce))
      .then(token => this.getSession(token))
      .then(session => {
        if (session) {
          this._headers.Authorization = `Layer session-token="${session}"`;
        }
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

  createConversation(participants) {
    return fetch(this._layerUrl + '/conversations', {
      method: 'post',
      headers: this._headers,
      body: JSON.stringify({
        participants: participants,
        distinct: false,
      }),
    })
    .then(res => res.json());
  }

  getMessages(conversationUrl) {
    return fetch(conversationUrl + '/messages', {
      method: 'get',
      headers: this._headers,
    })
    .then(res => res.json());
  }

  sendMessage(conversationUrl, body, mimeType) {
    return fetch(conversationUrl + '/messages', {
      method: 'post',
      headers: this._headers,
      body: JSON.stringify({
        parts: [{
          body: body,
          mime_type: mimeType,
        }],
      }),
    });
  }
}

export default new LayerUtils();
