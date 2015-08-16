import React, {Component} from 'react';

export default class SettingsHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  _onBack() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div id="settings-handler">
        Settings
        <button onClick={::this._onBack}>Back</button>
      </div>
    );
  }
}
