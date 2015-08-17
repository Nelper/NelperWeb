import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import BrowseActions from 'actions/BrowseActions';
import UserActions from 'actions/UserActions';
import NelpStore from 'stores/NelpStore';
import UserStore from 'stores/UserStore';
import BrowseTasksFilterView from './BrowseTasksFilterView';
import NelpTaskListView from './BrowseTasksListView';
import MapView from './MapView';
import GoogleMapsUtils from 'utils/GoogleMapsUtils';

@connectToStores
export default class BrowseTasksHandler extends Component {

  static propTypes = {
    tasks: PropTypes.array.isRequired,
  }

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
    if (UserStore.state.user.location) {
      BrowseActions.refreshTasks({sort: 'distance'}, UserStore.state.user.location);
    } else {
      BrowseActions.refreshTasks({sort: 'date'});

      // TODO(janic): this logic should be elsewhere.
      navigator.geolocation.getCurrentPosition((pos) => {
        UserActions.setLocation(pos.coords);

        if (!this.refs.map) {
          return;
        }
        this.refs.map.panTo(new GoogleMapsUtils.LatLng(
          pos.coords.latitude,
          pos.coords.longitude,
        ));
      });
    }
  }

  _onMarkerClick(event, filterKey) {
    this.setState({
      taskFilter: filterKey,
    });
    this.refs.map.panTo(event.latLng);
  }

  _onFiltersChanged(filters) {
    BrowseActions.refreshTasks(filters, UserStore.state.user.location);
  }

  _onTaskSelected(task) {
    if (task.location) {
      this.refs.map.panTo(new GoogleMapsUtils.LatLng(
        task.location.latitude,
        task.location.longitude,
      ));
    }
  }

  _onApply(task) {
    // Make sure the user is logged to apply on a task.
    if (!UserStore.isLogged()) {
      this.context.router.transitionTo('/login', null, { nextPathname: '/nelp' });
      return;
    }
    BrowseActions.applyForTask(task);
  }

  _onCancelApply(task) {
    BrowseActions.cancelApplyForTask(task);
  }

  _closeDetail() {
    this.setState({
      taskCollapsed: true,
    });
  }

  render() {
    const {taskFilter} = this.state;

    const taskGroups = this.props.tasks
      .filter(t => t.location)
      .reduce((prev, cur) => {
        const mapKey = `${cur.location.latitude}:${cur.location.longitude}`;
        if (prev[mapKey]) {
          prev[mapKey].push(cur);
        } else {
          prev[mapKey] = [cur];
        }
        return prev;
      }, {});

    const markers = Object.keys(taskGroups)
      .map(k => {
        const cur = taskGroups[k];
        return {
          key: k,
          position: new GoogleMapsUtils.LatLng(
            cur[0].location.latitude,
            cur[0].location.longitude,
          ),
          onClick: (event) => this._onMarkerClick(event, k),
        };
      });

    const filteredTasks = taskFilter ?
      taskGroups[this.state.taskFilter] :
      this.props.tasks;

    const pos = UserStore.state.user.location;
    const center = pos ?
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
              <BrowseTasksFilterView onFiltersChanged={::this._onFiltersChanged} />
            </div>
          </div>
          <div className="container pad-hor">
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
}
