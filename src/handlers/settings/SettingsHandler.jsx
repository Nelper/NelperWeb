import React, {Component} from 'react';

export default class SettingsHandler extends Component {

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  _onBack() {
    this.context.history.goBack();
  }

  render() {
    return (
      <div className="settings-handler container">
        Settings
        <button onClick={::this._onBack}>Back</button>
      </div>
    );
  }
}
