import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';
import createId from 'utils/createId';

class UserActions {

  constructor() {
    this.generateActions('receivedUser', 'receivedPicture');
  }

  login(loginInfo) {
    ApiUtils.login(loginInfo)
      .then((user) => {
        this.actions.receivedUser(user);
      })
      .fail(err => {
        console.log(err);
      });
  }

  register(registerInfo) {
    ApiUtils.register(registerInfo)
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
    this.actions.receivedUser({logged: false});
    // Refresh the page to prevent a weird bug with
    // facebook login after logging out.
    window.location.reload();
  }

  setLocation(loc) {
    ApiUtils.setUserLocation(loc);
    return loc;
  }

  setPicture(file) {
    ApiUtils.setUserPicture(file)
      .then((picture) => {
        this.actions.receivedPicture(picture);
      });
  }

  update() {
    ApiUtils.updateUser()
      .then((user) => {
        this.actions.receivedUser(user);
      });
  }
}

export default alt.createActions(UserActions);
