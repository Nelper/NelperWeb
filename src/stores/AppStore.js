import alt from 'app/alt';
import Storage from 'utils/Storage';
import AppActions from 'actions/AppActions';

const LOCALSTORAGE_KEY = 'appStore';

class AppStore {

  state = Storage.getItem(LOCALSTORAGE_KEY, {
    nelpCenter: {
      selectedTab: 'tasks',
    },
  })

  constructor() {
    this.bindListeners({
      handleSetSelectedTab: AppActions.SET_SELECTED_TAB,
    });
  }

  handleSetSelectedTab(tab) {
    this.setState({
      nelpCenter: {
        selectedTab: tab,
      },
    });

    this.saveStore();
  }

  saveStore() {
    Storage.setItem(LOCALSTORAGE_KEY, this.state);
  }
}

export default alt.createStore(AppStore, 'AppStore');
