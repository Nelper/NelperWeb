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
        this.refs.map.panTo(new GoogleMapsAPI.LatLng(
          pos.coords.latitude,
          pos.coords.longitude,
        ));
      });
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
          onClick={(event) => this._onMarkerClick(event, k)}/>
        );
      });

    let filteredTasks = this.state.taskFilter ?
      taskGroups[this.state.taskFilter] :
      this.props.tasks;
    let displayedTasks = filteredTasks.map((t) => {
      return (
        <div key={t.objectId}
        className="task"
        onClick={this._taskDetail.bind(this, t)}>
          {t.title}
        </div>
      );
    });

    let pos = UserStore.state.user.location;
    let center = pos ?
      new GoogleMapsAPI.LatLng(pos.latitude, pos.longitude) :
      new GoogleMapsAPI.LatLng(0, 0);
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
              center={center}>
              {markers}
            </GoogleMaps>
          </div>
        </div>
        <div className="header-border" />
        <div className="container pad-all">
          {
            this.state.taskFilter ?
            <div>
              <div>Tasks near {this.state.taskFilter}</div>
              <button onClick={::this._resetFilter}>Reset</button>
            </div> :
            null
          }
          <div className="tasks">
          {displayedTasks}
          </div>
        </div>
      </div>
    );
  }

  _onMarkerClick(event, filterKey) {
    this.setState({
      taskFilter: filterKey,
    });
    this.refs.map.panTo(event.latLng);
  }

  _resetFilter() {
    this.setState({
      taskFilter: null,
    });
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/nelp/detail/${task.objectId}`, null, {task});
  }
}
