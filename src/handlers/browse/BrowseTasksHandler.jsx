import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import BrowseActions from 'actions/BrowseActions';
import UserActions from 'actions/UserActions';
import BrowseStore from 'stores/BrowseStore';
import UserStore from 'stores/UserStore';
import BrowseTasksFilterView from './BrowseTasksFilterView';
import NelpTaskListView from './BrowseTasksListView';
import MapView from './MapView';
import {LatLng} from 'utils/GoogleMapsUtils';

@connectToStores
export default class BrowseTasksHandler extends Component {

  static propTypes = {
    tasks: PropTypes.array.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [BrowseStore];
  }

  static getPropsFromStores() {
    return BrowseStore.getState();
  }

  state = {
    filters: UserStore.state.user.location ? {sort: 'distance'} : {sort: 'date'},
    taskFilter: null,
    isLoadingMore: false,
  }

  componentDidMount() {
    if (UserStore.state.user.location) {
      BrowseActions.refreshTasks(this.state.filters, UserStore.state.user.location);
    } else {
      BrowseActions.refreshTasks(this.state.filters);

      // TODO(janic): this logic should be elsewhere.
      navigator.geolocation.getCurrentPosition((pos) => {
        UserActions.setLocation(pos.coords);

        if (!this.refs.map) {
          return;
        }
        this.refs.map.panTo(new LatLng(
          pos.coords.latitude,
          pos.coords.longitude,
        ));
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.tasks.length !== this.props.tasks.length) {
      this.setState({isLoadingMore: false});
    }
  }

  _onMarkerClick(event, filterKey) {
    this.setState({
      taskFilter: filterKey,
    });
    this.refs.map.panTo(event.latLng);
  }

  _onFiltersChanged(filters) {
    this.setState({filters});
    BrowseActions.refreshTasks(filters, UserStore.state.user.location);
  }

  _onTaskSelected(task) {
    if (task.location) {
      this.refs.map.panTo(new LatLng(
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

  _onLoadMore() {
    BrowseActions.refreshTasks(
      Object.assign({skip: this.props.tasks.length - 1, limit: 6}, this.state.filters),
      UserStore.state.user.location,
    );
    this.setState({isLoadingMore: true});
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
          position: new LatLng(
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
      new LatLng(pos.latitude, pos.longitude) :
      new LatLng(0, 0);

    return (
      <div className="nelp-handler">
        <div className="container header-section">
          <div className="map">
            <MapView
              markers={markers}
              initialCenter={center}
              ref="map" />
          </div>
        </div>
        <div className="task-section" ref="taskScroll">
          <div className="filters container pad-all">
            <div>
              <BrowseTasksFilterView onFiltersChanged={::this._onFiltersChanged} />
            </div>
          </div>
          <div className="container panel">
            <NelpTaskListView
              tasks={filteredTasks}
              onTaskSelected={::this._onTaskSelected}
              onApply={::this._onApply}
              onCancelApply={::this._onCancelApply}
              onLoadMore={::this._onLoadMore}
              isLoading={this.state.isLoadingMore}
            />
          </div>
        </div>
      </div>
    );
  }
}
