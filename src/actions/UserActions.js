import alt from 'app/alt';
import ApiUtils from 'utils/ApiUtils';
import createId from 'utils/createId';

class UserActions {

  constructor() {
    this.generateActions('receivedUser');
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

  setPicture(file) {
    ApiUtils.setUserPicture(file);
    return file;
  }

  editAbout(about) {
    ApiUtils.editUserAbout(about);
    return about;
  }

  addSkill(skill) {
    skill.objectId = createId();
    ApiUtils.addUserSkill(skill);
    return skill;
  }

  editSkill(skill) {
    ApiUtils.editUserSkill(skill);
    return skill;
  }

  deleteSkill(skill) {
    ApiUtils.deleteUserSkill(skill);
    return skill;
  }

  addExperience(exp) {
    exp.objectId = createId();
    ApiUtils.addUserExperience(exp);
    return exp;
  }

  editExperience(exp) {
    ApiUtils.editUserExperience(exp);
    return exp;
  }

  deleteExperience(exp) {
    ApiUtils.deleteUserExperience(exp);
    return exp;
  }

  update() {
    ApiUtils.updateUser()
      .then((user) => {
        this.actions.receivedUser(user);
      });
  }
}

export default alt.createActions(UserActions);
