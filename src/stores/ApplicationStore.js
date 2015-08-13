import alt from 'app/alt';
import ApplicationActions from 'actions/ApplicationActions';

class ApplicationStore {

  state = {
    applications: [],
  }

  constructor() {
    this.bindListeners({
      handleReceivedApplications: ApplicationActions.RECEIVED_APPLICATIONS,
    });
  }

  handleReceivedApplications(applications) {
    this.setState({
      applications: applications,
    });
  }
}

export default alt.createStore(ApplicationStore, 'ApplicationStore');
