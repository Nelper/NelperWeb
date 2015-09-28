import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

import UserActions from 'actions/UserActions';
import MapView from 'components/MapView';
import BrowseTasksFilterView from './BrowseTasksFilterView';
import NelpTaskListView from './BrowseTasksListView';
import {LatLng} from 'utils/GoogleMapsUtils';

import styles from './BrowseTasksHandler.scss';

@cssModules(styles)
class BrowseTasksHandler extends Component {

  static propTypes = {
    browse: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  state = {
    filters: {category: null, minPrice: null, maxDistance: null},
    sort: this._getInitialLocation() ? {sort: 'DISTANCE'} : {sort: 'DATE'},
    taskFilter: null,
    location: this._getInitialLocation() || {latitude: 45.5016889, longitude: -73.567256},
  }

  componentDidMount() {
    if (__CLIENT__ && !this._getInitialLocation()) {
      // TODO(janic): this logic should be elsewhere.
      navigator.geolocation.getCurrentPosition((pos) => {
        UserActions.setLocation(pos.coords);
        this.setState({location: pos.coords});
        if (this.refs.map) {
          this.refs.map.panTo(new LatLng(
            pos.coords.latitude,
            pos.coords.longitude,
          ));
        }
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
    this.setState({filters});
  }

  _onSort(sort) {
    this.setState({sort: {sort}});
  }

  _onTaskSelected(task) {
    if (task.location) {
      this.refs.map.panTo(new LatLng(
        task.location.latitude,
        task.location.longitude,
      ));
    }
  }

  _closeDetail() {
    this.setState({
      taskCollapsed: true,
    });
  }

  _getInitialLocation() {
    if (this.props.me.logged && this.props.me.privateData.location) {
      return this.props.me.privateData.location;
    }
    return null;
  }

  render() {
    const {sort} = this.state;
    const {tasks} = this.props.browse;

    const taskGroups = tasks.edges
      .map(edge => edge.node)
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

    const pos = this.state.location;
    const center = pos ?
      new LatLng(pos) :
      new LatLng(0, 0);

    return (
      <div styleName="module">
        <div styleName="header" className="container">
          <div styleName="map">
            <MapView
              markers={markers}
              initialCenter={center}
              ref="map" />
          </div>
        </div>
        <div className="task-section" ref="taskScroll">
          <div styleName="filters" className="container">
            <BrowseTasksFilterView onFiltersChanged={::this._onFiltersChanged} />
          </div>
          <div className="container panel">
            <div styleName="sort-container">
              <div styleName="sort" className="toggle-group">
                <button
                  className={classNames('toggle', {'on': sort.sort === 'PRICE'})}
                  onClick={() => this._onSort('PRICE')}
                >
                  <FormattedMessage id="browse.price"/>
                </button>
                <button
                  className={classNames('toggle', {'on': sort.sort === 'DISTANCE'})}
                  onClick={() => this._onSort('DISTANCE')}
                >
                  <FormattedMessage id="browse.distance"/>
                </button>
                <button
                  className={classNames('toggle', {'on': sort.sort === 'DATE'})}
                  onClick={() => this._onSort('DATE')}
                >
                  <FormattedMessage id="browse.date"/>
                </button>
              </div>
            </div>
            <NelpTaskListView
              browse={this.props.browse}
              filters={{
                location: this.state.location,
                sort: this.state.sort.sort,
                ...this.state.filters,
              }}
              onTaskSelected={::this._onTaskSelected}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(BrowseTasksHandler, {
  initialVariables: {
    first: 10,
  },
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        logged,
        privateData {
          location {
            latitude,
            longitude,
          }
        }
      }
    `,
    browse: () => Relay.QL`
      fragment on Browse {
        tasks(first: $first) {
          edges {
            node {
              location {
                latitude,
                longitude,
              }
            }
          }
        }
        ${NelpTaskListView.getFragment('browse')}
      }
    `,
  },
});
