import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import {GoogleMaps, Marker} from 'react-google-maps';

import NelpActions from 'actions/NelpActions';
import UserActions from 'actions/UserActions';
import NelpStore from 'stores/NelpStore';
import UserStore from 'stores/UserStore';

const GoogleMapsAPI = window.google.maps;

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

  state = {
    mapLocation: new GoogleMapsAPI.LatLng(0, 0),
    taskFilter: null,
  }

  componentDidMount() {
    NelpActions.refreshTasks();
    // TODO(janic): this logic should be elsewhere.
    if(!UserStore.state.user.location) {
      navigator.geolocation.getCurrentPosition((pos) => {
        UserActions.setLocation(pos.coords);
        if(!this.refs.map) {
          return;
        }
        this.setState({mapLocation: new GoogleMapsAPI.LatLng(
          pos.coords.latitude,
          pos.coords.longitude,
        )});
      });
    } else {
      let loc = UserStore.state.user.location;
      this.setState({mapLocation: new GoogleMapsAPI.LatLng(
        loc.latitude,
        loc.longitude,
      )});
    }
  }

  render() {
    let taskGroups = this.props.tasks
      .filter(t => t.location)
      .reduce((prev, cur) => {
        let mapKey = `${cur.location.latitude}:${cur.location.longitude}`;
        if(prev[mapKey]) {
          prev[mapKey].push(cur);
        } else {
          prev[mapKey] = [cur];
        }
        return prev;
      }, {});

    let markers = Object.keys(taskGroups)
      .map(k => {
        let cur = taskGroups[k];
        return (
          <Marker position={new GoogleMapsAPI.LatLng(
            cur[0].location.latitude,
            cur[0].location.longitude,
           )}
          onClick={() => this._onMarkerClick(k)}/>
        );
      });

    let filteredTasks = this.state.taskFilter ?
      taskGroups[this.state.taskFilter] :
      this.props.tasks;
    let displayedTasks = filteredTasks.map((t) => {
      return (
        <div key={t.objectId} className="task" onClick={this._taskDetail.bind(this, t)}>{t.title}</div>
      );
    });

    return (
      <div id="nelp-handler">
        <div className="header-section">
          <div className="container">
            <GoogleMaps containerProps={{
                style: {
                  width: '100%',
                  height: 300,
                },
              }}
              ref="map"
              googleMapsApi={GoogleMapsAPI}
              zoom={11}
              center={this.state.mapLocation}>
              {markers}
            </GoogleMaps>
          </div>
        </div>
        <div className="header-border" />
        <div className="container pad-all">
          {displayedTasks}
        </div>
      </div>
    );
  }

  _onMarkerClick(filterKey) {
    this.setState({
      taskFilter: filterKey,
    });
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/nelp/detail/${task.objectId}`, null, {task});
  }
}
