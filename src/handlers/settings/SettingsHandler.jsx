import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import cssModules from 'react-css-modules';

import Progress from 'components/Progress';
import UserStore from 'stores/UserStore';
import UserActions from 'actions/UserActions';

import styles from './SettingsHandler.scss';

@connectToStores
@cssModules(styles)
export default class SettingsHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  _onChangeLanguage(event) {
    UserActions.changeLanguage(event.target.value);
  }

  render() {
    const {user} = this.props;

    if (!user.privateData) {
      return <div className="progress-center"><Progress /></div>;
    }

    return (
      <div className="settings-handler container">
        <div className="panel pad-all">
          <h2 styleName="title">Settings</h2>
          <div>Language: </div>
          <select value={user.privateData.language} onChange={this._onChangeLanguage}>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    );
  }
}
