import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

class ApplicationActions {

  constructor() {
    this.generateActions(
      'receivedApplications',
      'receivedTaskPosterInfo',
    );
  }

  refreshMyApplications() {
    ApiUtils.listMyApplications()
      .then((applications) => {
        this.actions.receivedApplications(applications);
      });
  }

  requestTaskPosterInfo(application) {
    ApiUtils.requestTaskPosterInfo(application)
    .then(info => {
      this.actions.receivedTaskPosterInfo({application, info});
    });
  }
}

export default alt.createActions(ApplicationActions);
