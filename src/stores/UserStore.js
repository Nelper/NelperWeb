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
    });
  }

  handleReceivedUser(user) {
    Storage.setItem('user', user);
    this.setState({
      user: user,
    });
  }

  handleSetLoc(loc) {
    let user = this.state.user;
    user.location = loc;
    this.setState({user});
  }
}

export default alt.createStore(UserStore, 'UserStore');
