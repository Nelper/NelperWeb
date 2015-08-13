import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

class ApplicationActions {

  constructor() {
    this.generateActions('receivedApplications');
  }

  refreshMyApplications() {
    ApiUtils.listMyApplications()
      .then((applications) => {
        this.actions.receivedApplications(applications);
      });
  }
}

export default alt.createActions(ApplicationActions);
