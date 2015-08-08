import React, {Component, PropTypes} from 'react';
import {GoogleMap, Marker} from 'react-google-maps';

import GoogleMapsUtils from 'utils/GoogleMapsUtils';

export default class MapView extends Component {

  static propTypes = {
    initialCenter: PropTypes.object,
    initialZoom: PropTypes.object,
  }

  state = {
    googleMapsAPI: GoogleMapsUtils.get(),
    location: this.props.initialCenter,
  }
  loaded = false

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

    if(!this.state.googleMapsAPI) {
      return null;
    }

    let markers = this.props.markers.map((m) => {
      return (
        <Marker
          key={m.key}
          position={m.position}
          onClick={m.onClick}/>
      );
    });

    return (
      <GoogleMap containerProps={{
          style: {
            width: '100%',
            height: '100%',
          },
        }}
        ref="map"
        googleMapsApi={this.state.googleMapsAPI}
        defaultZoom={15}
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

  _onDragEnd() {
    this.setState({
      location: this.refs.map.getCenter(),
    });
  }
}
