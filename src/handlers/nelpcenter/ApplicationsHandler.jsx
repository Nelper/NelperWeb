import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import ApplicationCardView from './ApplicationCardView';
import ApplicationActions from 'actions/ApplicationActions';
import ApplicationStore from 'stores/ApplicationStore';

@connectToStores
export default class ApplicationsHandler extends Component {

  static propTypes = {
    applications: PropTypes.array.isRequired,
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
    ApplicationActions.refreshMyApplications();
  }

  render() {
    const applications = this.props.applications.map(a => {
      return <ApplicationCardView application={a} />;
    });

    return (
      <div className="applications-handler">
        <div className="container pad-all tasks">
          {applications}
        </div>
      </div>
    );
  }
}
