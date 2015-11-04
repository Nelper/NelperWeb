import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

class UserActions {

  constructor() {
    this.generateActions('receivedUser', 'receivedPicture');
  }

  logout() {
    ApiUtils.logout();
    this.actions.receivedUser({logged: false});
    // Refresh the page to prevent a weird bug with
    // facebook login after logging out.
    window.location = '/';
  }

  setLocation(loc) {
    ApiUtils.setUserLocation(loc);
    return loc;
  }

  update() {
    ApiUtils.updateUser()
      .then((user) => {
        this.actions.receivedUser(user);
      });
  }
}

export default alt.createActions(UserActions);
