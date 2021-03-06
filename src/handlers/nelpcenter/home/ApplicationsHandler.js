import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';

import ApplicationCardView from './ApplicationCardView';

import styles from './ApplicationsHandler.scss';

@cssModules(styles)
class ApplicationsHandler extends Component {

  static propTypes = {
    me: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  _onShowApplicationDetail(application) {
    this.context.router.pushState(null, `/center/applications/detail/${application.id}`);
  }

  render() {
    const {applications} = this.props.me;
    const displayedApplications = applications.edges
      .map(edge => {
        const a = edge.node;
        return (
          <ApplicationCardView
            key={a.id}
            application={a}
            onClick={() => this._onShowApplicationDetail(a)}
          />
        );
      });

    return (
      <div styleName="applications-handler">
        <div className="container pad-hor-sm">
        {
          !displayedApplications.length ?
          <div styleName="no-application">
            <div styleName="no-application-text">
              <FormattedMessage id="nelpcenter.myApplications.noApplication" />
            </div>
            <Link to="/browse">
              <button className="primary">
                <FormattedMessage id="nelpcenter.myApplications.browse" />
              </button>
            </Link>
          </div> :
          <div>{displayedApplications}</div>
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
