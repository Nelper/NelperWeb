import React, {Component, PropTypes} from 'react';
import {GoogleMap, Marker} from 'react-google-maps';

import GoogleMapsUtils from 'utils/GoogleMapsUtils';

export default class MapView extends Component {

  static propTypes = {
    initialCenter: PropTypes.object,
    initialZoom: PropTypes.number,
    markers: PropTypes.array,
  }

  static defaultProps = {
    initialZoom: 15,
    markers: [],
  }

  state = {
    googleMapsAPI: GoogleMapsUtils.get(),
    location: this.props.initialCenter,
  }
  loaded = false

  componentDidMount() {
    if (!GoogleMapsUtils.get()) {
      GoogleMapsUtils.load().then((maps) => {
        this.setState({
          googleMapsAPI: maps,
        });
      });
    }
  }

  _onDragEnd() {
    this.setState({
      location: this.refs.map.getCenter(),
    });
  }

  render() {
    if (!this.state.googleMapsAPI) {
      return <div />;
    }

    const markers = this.props.markers.map((m) => {
      return (
        <Marker
          key={m.key}
          position={m.position}
          onClick={m.onClick}/>
      );
    });

    return (
      <GoogleMap
        containerProps={{
          style: {
            width: '100%',
            height: '100%',
          },
        }}
        ref="map"
        defaultZoom={this.props.initialZoom}
        onDragend={::this._onDragEnd}
        center={this.state.location}>
        {markers}
      </GoogleMap>
    );
  }

  panTo(latLng) {
    this.setState({
      location: latLng,
    });
  }
}
