import React, {Component, PropTypes} from 'react';
import {GoogleMap, Marker, Circle} from 'react-google-maps';

import Colors from 'utils/Colors';
import GoogleMapsUtils from 'utils/GoogleMapsUtils';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

export default class MapView extends Component {

  static propTypes = {
    initialCenter: PropTypes.object,
    initialZoom: PropTypes.number,
    markers: PropTypes.array,
    shapes: PropTypes.array,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    initialZoom: 15,
    markers: [],
    shapes: [],
    disabled: false,
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

    const shapes = this.props.shapes.map(s => {
      return (
        <Circle
          key={s.key}
          center={s.center}
          radius={s.radius}
          options={{
            fillColor: Colors.primary,
            strokeColor: Colors.primary,
          }}
        />
      );
    });

    const markers = this.props.markers.map((m) => {
      return (
        <Marker
          key={m.key}
          icon={{
            scaledSize: {
              height: 50,
              width: 50,
            },
            url: m.category ?
              TaskCategoryUtils.getPinImage(m.category) :
              require('images/icons/pin-map.png'),
          }}
          position={m.position}
          onClick={m.onClick}
        />
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
        center={this.state.location}
        options={{
          streetViewControl: true,
          mapTypeControl: false,
          scrollwheel: !this.props.disabled,
        }}
      >
        {markers}
        {shapes}
      </GoogleMap>
    );
  }

  panTo(latLng) {
    this.setState({
      location: latLng,
    });
  }
}
