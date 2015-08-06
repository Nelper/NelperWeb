import React, {Component, PropTypes} from 'react';
import {GoogleMaps, Marker} from 'react-google-maps';

import GoogleMapsUtils from 'utils/GoogleMapsUtils';

export default class MapView extends Component {

  static propTypes = {
    initialCenter: PropTypes.object,
    initialZoom: PropTypes.object,
  }

  state = {
    googleMapsAPI: GoogleMapsUtils.get(),
    location: this.props.initialCenter,
    zoom: this.props.initialZoom || 15,
  }

  loaded = false;

  componentDidMount() {
    if(!GoogleMapsUtils.get()) {
      GoogleMapsUtils.load(() => {
        this.setState({
          googleMapsAPI: GoogleMapsUtils.get(),
        });
      });
    }
  }

  render() {

    let markers = this.props.markers.map((m) => {
      return (
        <Marker
          key={m.key}
          position={m.position}
          onClick={m.onClick}/>
      );
    });

    return (
      <GoogleMaps containerProps={{
          style: {
            width: '100%',
            height: '100%',
          },
        }}
        ref="map"
        googleMapsApi={this.state.googleMapsAPI}
        zoom={this.state.zoom}
        onZoomChanged={::this._onZoom}
        onDragend={::this._onDragEnd}
        center={this.state.location}>
        {markers}
      </GoogleMaps>
    );
  }

  panTo(latLng) {
    this.setState({
      location: latLng,
    });
  }

  _onDragEnd() {
    this.setState({
      location: this.refs.map.getCenter(),
    });
  }

  _onZoom() {
    let zoom = this.refs.map.getZoom();
    if(zoom !== this.state.zoom) {
      this.setState({
        zoom,
      });
    }
  }
}
