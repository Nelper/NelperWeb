import React, {Component} from 'react';
import cssModules from 'react-css-modules';

import ApiUtils from 'utils/ApiUtils';

let GraphiQL;
if (__CLIENT__) {
  GraphiQL = require('graphiql');
}

import styles from './GraphiQLHandler.scss';
import 'graphiql/graphiql.css';

@cssModules(styles)
export default class GraphiQLHandler extends Component {

  state = {
    userId: '',
    sessionToken: '',
  }

  componentDidMount() {
    if (__CLIENT__) {
      const session = ApiUtils.getUserSession();
      if (session) {
        const [userId, sessionToken] = session.split('-');
        this.setState({
          userId,
          sessionToken,
        });
      }
    }
  }

  _onUserIdChange(event) {
    this.setState({userId: event.target.value});
  }

  _onSessionTokenChange(event) {
    this.setState({sessionToken: event.target.value});
  }

  _graphQLFetcher(graphQLParams) {
    return fetch(window.location.origin + '/graphql', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.state.userId}-${this.state.sessionToken}`,
      },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

  render() {
    return (
      <div styleName="module" className="container pad-all">
        <h2>Query explorer</h2>
        <div>
          <h3>User ID</h3>
          <input
            type="text"
            value={this.state.userId}
            onChange={::this._onUserIdChange}
          />
          <h3>Session Token</h3>
          <input
            type="text"
            value={this.state.sessionToken}
            onChange={::this._onSessionTokenChange}
          />
        </div>
        {
          __CLIENT__ ?
          <GraphiQL fetcher={::this._graphQLFetcher} /> :
          null
        }
      </div>
    );
  }
}
