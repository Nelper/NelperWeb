import alt from 'app/alt';
import Storage from 'utils/Storage';
import UserActions from 'actions/UserActions';

class UserStore {

  state = {
    user: Storage.getItem('user') || {logged: false},
  }

  static isLogged() {
    return this.getState().user.logged;
  }

  constructor() {
    this.bindListeners({
      handleReceivedUser: UserActions.RECEIVED_USER,
      handleSetLoc: UserActions.SET_LOCATION,
      handleAddLoc: UserActions.ADD_LOCATION,
      handleReceivedPicture: UserActions.RECEIVED_PICTURE,
      handleEditAbout: UserActions.EDIT_ABOUT,
      handleAddSkill: UserActions.ADD_SKILL,
      handleEditSkill: UserActions.EDIT_SKILL,
      handleDeleteSkill: UserActions.DELETE_SKILL,
      handleAddExperience: UserActions.ADD_EXPERIENCE,
      handleEditExperience: UserActions.EDIT_EXPERIENCE,
      handleDeleteExperience: UserActions.DELETE_EXPERIENCE,
      handleAddEducation: UserActions.ADD_EDUCATION,
      handleEditEducation: UserActions.EDIT_EDUCATION,
      handleDeleteEducation: UserActions.DELETE_EDUCATION,
    });
  }

  handleReceivedUser(user) {
    this.setState({
      user: user,
    });
    Storage.setItem('user', user);
  }

  handleSetLoc(loc) {
    const user = this.state.user;
    user.location = {latitude: loc.latitude, longitude: loc.longitude};
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleAddLoc(loc) {
    const user = this.state.user;
    user.privateData.locations.push(loc);
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleReceivedPicture(file) {
    const user = this.state.user;
    user.pictureURL = file.url;
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleEditAbout(about) {
    const user = this.state.user;
    user.about = about;
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleAddSkill(skill) {
    const user = this.state.user;
    user.skills.push(skill);
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleEditSkill(skill) {
    const user = this.state.user;
    user.skills[user.skills.indexOf(skill)] = skill;
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleDeleteSkill(skill) {
    const user = this.state.user;
    user.skills.splice(user.skills.indexOf(skill), 1);
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleAddExperience(exp) {
    const user = this.state.user;
    user.experience.push(exp);
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleEditExperience(exp) {
    const user = this.state.user;
    user.experience[user.experience.indexOf(exp)] = exp;
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleDeleteExperience(exp) {
    const user = this.state.user;
    user.experience.splice(user.experience.indexOf(exp), 1);
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleAddEducation(ed) {
    const user = this.state.user;
    user.education.push(ed);
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleEditEducation(ed) {
    const user = this.state.user;
    user.education[user.education.indexOf(ed)] = ed;
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleDeleteEducation(ed) {
    const user = this.state.user;
    user.education.splice(user.education.indexOf(ed), 1);
    this.setState({user});
    Storage.setItem('user', user);
  }
}

export default alt.createStore(UserStore, 'UserStore');
