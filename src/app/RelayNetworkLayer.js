import Relay from 'react-relay';

export default class RelayNetworkLayer extends Relay.DefaultNetworkLayer {
  constructor(session) {
    const endpoint = __DEVELOPMENT__ ? 'http://localhost:8081/graphql' : '/graphql';
    const headers = {};
    if (session) {
      headers.Authorization = session;
    }
    super(endpoint, {
      headers,
    });
  }
}
