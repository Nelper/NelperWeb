import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import connectToStores from 'alt/utils/connectToStores';

import Progress from 'components/Progress';
import ApplicationCardView from './ApplicationCardView';
import ApplicationActions from 'actions/ApplicationActions';
import ApplicationStore from 'stores/ApplicationStore';

@connectToStores
export default class ApplicationsHandler extends Component {

  static propTypes = {
    applications: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [ApplicationStore];
  }

  static getPropsFromStores() {
    return ApplicationStore.getState();
  }

  componentDidMount() {
    if (__CLIENT__) {
      ApplicationActions.refreshMyApplications();
    }
  }

  _onShowApplicationDetail(application) {
    this.context.router.transitionTo(`/center/applications/detail/${application.objectId}`);
  }

  render() {
    const applications = this.props.applications.map(a => {
      return <ApplicationCardView key={a.objectId} application={a} onClick={() => this._onShowApplicationDetail(a)} />;
    });

    if (this.props.isLoading) {
      return (
        <div className="progress-center"><Progress /></div>
      );
    }

    return (
      <div className="applications-handler">
        <div className="container pad-hor-sm">
        {
          !applications.length ?
          <div className="no-application">
            <div className="no-application-text">You have no application. Browse tasks now to complete a task!</div>
            <Link to="/browse"><button className="primary">Browse Tasks</button></Link>
          </div> :
          <div className="applications">{applications}</div>
        }
        </div>
      </div>
    );
  }
}
