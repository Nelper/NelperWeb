import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

import ApplicationCardView from './ApplicationCardView';

class ApplicationsHandler extends Component {

  static propTypes = {
    me: PropTypes.object.isRequired,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  _onShowApplicationDetail(application) {
    this.context.history.pushState(null, `/center/applications/detail/${application.id}`);
  }

  render() {
    const {applications} = this.props.me;
    const displayedApplications = applications.edges.map(edge => {
      const a = edge.node;
      return <ApplicationCardView key={a.id} application={a} onClick={() => this._onShowApplicationDetail(a)} />;
    });

    return (
      <div className="applications-handler">
        <div className="container pad-hor-sm">
        {
          !displayedApplications.length ?
          <div className="no-application">
            <div className="no-application-text">You have no application. Browse tasks now to complete a task!</div>
            <Link to="/browse"><button className="primary">Browse Tasks</button></Link>
          </div> :
          <div className="applications">{displayedApplications}</div>
        }
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationsHandler, {
  initialVariables: {
    first: 20,
  },
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        applications(first: $first) {
          edges {
            node {
              id,
              ${ApplicationCardView.getFragment('application')}
            }
          }
        }
      }
    `,
  },
});
