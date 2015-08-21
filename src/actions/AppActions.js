import alt from 'app/alt';

class AppActions {

  constructor() {
    this.generateActions('setSelectedTab');
  }
}

export default alt.createActions(AppActions);
