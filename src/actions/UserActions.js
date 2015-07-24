import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

class UserActions {

  constructor() {
    this.generateActions('receivedUser');
  }

  login() {
    ApiUtils.login()
      .then((user) => {
        this.actions.receivedUser(user);
      });
  }

  loginWithFacebook() {
    ApiUtils.loginWithFacebook()
      .then((user) => {
        this.actions.receivedUser(user);
      });
  }

  logout() {
    ApiUtils.logout();
    this.actions.receivedUser(null);
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
