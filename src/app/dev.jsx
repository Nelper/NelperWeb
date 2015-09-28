import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link} from 'react-router';
import {Parse} from 'parse';

import GraphiQLHandler from 'handlers/dev/GraphiQLHandler';

import 'normalize.css/normalize.css';
import 'styles/common.scss';
import 'file?name=[name].[ext]!images/favicon.ico';

class DevHandler extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      this.props.children
    );
  }
}

class Index extends Component {
  render() {
    return (
      <ul>
        <li><Link to="/graphiql">GraphiQL</Link></li>
      </ul>
    );
  }
}

// Initialize Parse
Parse.initialize('w6MsLIhprn1GaHllI4WYa8zcLghnPUQi5jwe7FxN', 'x6AWt2EdYFuK7HoDgQVI8xEJs6fsjcn3MHKr22si');

ReactDOM.render((
  <Router>
    <Route component={DevHandler}>
      <Route path="/graphiql" component={GraphiQLHandler} />
      <Route path="*" component={Index} />
    </Route>
  </Router>
), document.getElementById('app'));
