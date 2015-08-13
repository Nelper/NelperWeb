import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import ApplicationCardView from './ApplicationCardView';
import ApplicationActions from 'actions/ApplicationActions';
import ApplicationStore from 'stores/ApplicationStore';

@connectToStores
export default class ApplicationsHandler extends Component {

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
    let applications = this.props.applications.map(a => {
      return <ApplicationCardView application={a} />
    });

    return (
      <div id="nelp-center-handler">
        <div className="container pad-all tasks">
          {applications}
        </div>
      </div>
    );
  }
}
