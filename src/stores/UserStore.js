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
      handleReceivedPicture: UserActions.RECEIVED_PICTURE,
    });
  }

  handleReceivedUser(user) {
    this.setState({
      user: user,
    });
    Storage.setItem('user', user);
  }

  handleReceivedPicture(file) {
    const user = this.state.user;
    user.pictureURL = file.url;
    this.setState({user});
    Storage.setItem('user', user);
  }
}

export default alt.createStore(UserStore, 'UserStore');
