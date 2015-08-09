import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import NelpActions from 'actions/NelpActions';
import UserActions from 'actions/UserActions';
import NelpStore from 'stores/NelpStore';
import UserStore from 'stores/UserStore';
import NelpTaskFilterView from './NelpTaskFilterView';
import NelpTaskListView from './NelpTaskListView';
import MapView from './MapView';
import GoogleMapsUtils from 'utils/GoogleMapsUtils';

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
    if(!UserStore.state.user || !UserStore.state.user.location) {
      navigator.geolocation.getCurrentPosition((pos) => {
        if(UserStore.state.user) {
          UserActions.setLocation(pos.coords);
        }

        if(!this.refs.map) {
          return;
        }
        this.refs.map.panTo(new GoogleMapsUtils.LatLng(
          pos.coords.latitude,
          pos.coords.longitude,
        ));
      });
    }
  }

  render() {
    let {taskFilter} = this.state;

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
        return {
          key: k,
          position: new GoogleMapsUtils.LatLng(
            cur[0].location.latitude,
            cur[0].location.longitude,
          ),
          onClick: (event) => this._onMarkerClick(event, k),
        };
      });

    let filteredTasks = taskFilter ?
      taskGroups[this.state.taskFilter] :
      this.props.tasks;

    let pos = UserStore.state.user && UserStore.state.user.location;
    let center = pos ?
      new GoogleMapsUtils.LatLng(pos.latitude, pos.longitude) :
      new GoogleMapsUtils.LatLng(0, 0);
    return (
      <div id="nelp-handler">
        <div className="header-section">
          <div className="container map">
            <MapView
              markers={markers}
              initialCenter={center}
              ref="map" />
          </div>
        </div>
        <div className="task-section" ref="taskScroll">
          <div className="filters">
            <div className="container pad-hor">
              <NelpTaskFilterView onFilterChanged={::this._onFilterChanged} />
            </div>
          </div>
          <div className="container pad-all">
            <NelpTaskListView
              tasks={filteredTasks}
              onTaskSelected={::this._onTaskSelected}
              onApply={::this._onApply}
              onCancelApply={::this._onCancelApply} />
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

  _onFilterChanged(/*filter*/) {

  }

  _resetFilter() {
    this.setState({
      taskFilter: null,
    });
  }

  _onTaskSelected(task) {
    if(task.location) {
      this.refs.map.panTo(new GoogleMapsUtils.LatLng(
        task.location.latitude,
        task.location.longitude,
      ));
    }
  }

  _onApply(task) {
    // Make sure the user is logged to apply on a task.
    if(!UserStore.state.user) {
      this.context.router.transitionTo('/login', null, { nextPathname: '/nelp' });
      return;
    }
    NelpActions.applyForTask(task);
  }

  _onCancelApply(task) {
    NelpActions.cancelApplyForTask(task);
  }

  _closeDetail() {
    this.setState({
      taskCollapsed: true,
    });
  }
}
