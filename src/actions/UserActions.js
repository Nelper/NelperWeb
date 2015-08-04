import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';

class UserActions {

  constructor() {
    this.generateActions('receivedUser');
  }

  login(email, password) {
    ApiUtils.login(email, password)
      .then((user) => {
        this.actions.receivedUser(user);
      })
      .fail(err => {
        console.log(err);
      });
  }

  register(email, password, name) {
    ApiUtils.register(email, password, name)
      .then((user) => {
        this.actions.receivedUser(user);
      })
      .fail(err => {
        console.log(err);
      });
  }

  loginWithFacebook() {
    ApiUtils.loginWithFacebook()
      .then((user) => {
        this.actions.receivedUser(user);
      }).catch(err => {
        console.log(err);
      });
  }

  logout() {
    ApiUtils.logout();
    this.actions.receivedUser(null);
    // Refresh the page to prevent a weird bug with
    // facebook login after logging out.
    window.location.reload();
  }

  setLocation(loc) {
    ApiUtils.setUserLocation(loc);
    return loc;
  }

  addLocation(loc) {
    ApiUtils.addUserLocation(loc);
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
