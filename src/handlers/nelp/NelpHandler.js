import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import {GoogleMaps, Marker} from 'react-google-maps';

import NelpActions from 'actions/NelpActions';
import NelpStore from 'stores/NelpStore';

@connectToStores
export default class NelpHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [NelpStore];
  }

  static getPropsFromStores() {
    return NelpStore.getState();
  }

  componentDidMount() {
    NelpActions.refreshTasks();
    navigator.geolocation.getCurrentPosition((pos) => {
      this.refs.map.panTo({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }

  render() {
    let tasks = this.props.tasks.map((t) => {
      return (
        <div key={t.objectId} onClick={this._taskDetail.bind(this, t)}>{t.title}</div>
      );
    });
    return (
      <div id="nelp-handler">
        <div className="header-section">
          <div className="container">
            <GoogleMaps containerProps={{
                style: {
                  width: '100%',
                  height: 500,
                },
              }}
              ref="map"
              googleMapsApi={google.maps}
              zoom={11}
              center={{lat: 0, lng: 0}} />
          </div>
        </div>
        <div className="header-border" />
        <div className="container pad-all">
          {tasks}
        </div>
      </div>
    );
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/nelp/detail/${task.objectId}`, null, {task});
  }
}
