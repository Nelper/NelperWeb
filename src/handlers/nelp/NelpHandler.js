import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import classNames from 'classnames';

import NelpActions from 'actions/NelpActions';
import UserActions from 'actions/UserActions';
import NelpStore from 'stores/NelpStore';
import UserStore from 'stores/UserStore';
import NelpTaskDetail from './NelpTaskDetail';
import NelpTaskFilterView from './NelpTaskFilterView';
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
    selectedTask: null,
    taskCollapsed: true,
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
        this.refs.map.panTo(new GoogleMapsUtils.LatLng(
          pos.coords.latitude,
          pos.coords.longitude,
        ));
      });
    }
  }

  render() {
    let {taskFilter, selectedTask, taskCollapsed} = this.state;

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
        <div className="section-separator" />
        <div className="task-section" ref="taskScroll">
          <div className={classNames('task-detail', {'collapsed': taskCollapsed})}>
          {
            selectedTask ?
            <div className="container pad-all">
              <NelpTaskDetail
                  task={selectedTask}
                  onClose={::this._closeDetail} />
            </div> :
            null
          }
          </div>
          <div className="filters">
            <div className="container pad-hor">
              <NelpTaskFilterView onFilterChanged={::this._onFilterChanged} />
            </div>
          </div>
          <div className="container pad-all">
            <div className="tasks">
              {displayedTasks}
            </div>
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

  _onFilterChanged(filter) {

  }

  _resetFilter() {
    this.setState({
      taskFilter: null,
    });
  }

  _taskDetail(task) {
    this.setState({
      taskCollapsed: false,
      selectedTask: task,
    });
    this.refs.taskScroll.getDOMNode().scrollTop = 0;
    this.refs.map.panTo(new GoogleMapsUtils.LatLng(
      task.location.latitude,
      task.location.longitude,
    ));

    //this.context.router.transitionTo('/nelp/detail/' + task.objectId);
  }

  _closeDetail() {
    this.setState({
      taskCollapsed: true,
    });
  }
}
