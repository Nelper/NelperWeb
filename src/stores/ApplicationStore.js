import alt from 'app/alt';
import ApplicationActions from 'actions/ApplicationActions';

class ApplicationStore {

  state = {
    applications: [],
    isLoading: true,
  }

  constructor() {
    this.bindListeners({
      handleReceivedApplications: ApplicationActions.RECEIVED_APPLICATIONS,
      handleReceivedTaskPosterInfo: ApplicationActions.RECEIVED_TASK_POSTER_INFO,
    });
  }

  handleReceivedApplications(applications) {
    this.setState({
      applications: applications,
      isLoading: false,
    });
  }

  handleReceivedTaskPosterInfo({task, info}) {
    task.phone = info.phone;
    task.email = info.email;
    task.exactLocation = info.location;
    this.emitChange();
  }
}

export default alt.createStore(ApplicationStore, 'ApplicationStore');
