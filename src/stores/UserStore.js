import alt from 'app/alt';
import Storage from 'utils/Storage';
import UserActions from 'actions/UserActions';

class UserStore {

  state = {
    user: Storage.getItem('user'),
  }

  constructor() {
    this.bindListeners({
      handleReceivedUser: UserActions.RECEIVED_USER,
      handleSetLoc: UserActions.SET_LOCATION,
      handleAddLoc: UserActions.ADD_LOCATION,
      handleSetPicture: UserActions.SET_PICTURE,
      handleAddSkill: UserActions.ADD_SKILL,
      handleEditSkill: UserActions.EDIT_SKILL,
      handleDeleteSkill: UserActions.DELETE_SKILL,
    });
  }

  handleReceivedUser(user) {
    this.setState({
      user: user,
    });
    Storage.setItem('user', user);
  }

  handleSetLoc(loc) {
    let user = this.state.user;
    user.location = loc;
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleAddLoc(loc) {
    let user = this.state.user;
    user.privateData.locations.push(loc);
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleSetPicture(file) {
    let user = this.state.user;
    user.pictureURL = file.url;
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleAddSkill(skill) {
    let user = this.state.user;
    user.skills.push(skill);
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleEditSkill(skill) {
    let user = this.state.user;
    user.skills[user.skills.indexOf(skill)] = skill;
    this.setState({user});
    Storage.setItem('user', user);
  }

  handleDeleteSkill(skill) {
    let user = this.state.user;
    user.skills.splice(user.skills.indexOf(skill), 1);
    this.setState({user});
    Storage.setItem('user', user);
  }
}

export default alt.createStore(UserStore, 'UserStore');
