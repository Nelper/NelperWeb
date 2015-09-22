import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';

import Dialog from 'components/Dialog';
import GoogleMapsUtils from 'utils/GoogleMapsUtils';

import styles from './AddLocationDialogView.scss';

@cssModules(styles)
export default class AddLocationDialogView extends Component {

  static propTypes = {
    opened: PropTypes.bool,
    onLocationAdded: PropTypes.func,
    onCancel: PropTypes.func,
  }

  state = {
    name: '',
    address: '',
    coords: '',
    streetNumber: '',
    route: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    googleMaps: null,
  }

  // If the google maps autocomplete input has been initialized.
  _initializedAutocomplete = false

  componentDidMount() {
    GoogleMapsUtils.load().then((maps) => {
      this.setState({googleMaps: maps});
    });
  }

  componentDidUpdate() {
    const maps = this.state.googleMaps;
    if (maps && !this._initializedAutocomplete) {
      const addressInput = this.refs.address;
      if (addressInput) {
        this._initializedAutocomplete = true;
        const autocomplete = new maps.places.Autocomplete(addressInput);
        maps.event.addListener(autocomplete, 'place_changed', () => {
          const place = autocomplete.getPlace();

          function getAddressComponent(id) {
            return place.address_components.find(c => {
              return c.types.some(t => t === id);
            });
          }

          const streetNumber = getAddressComponent('street_number').long_name;
          const route = getAddressComponent('route').long_name;
          const city = getAddressComponent('locality').long_name;
          const province = getAddressComponent('administrative_area_level_1').short_name;
          const country = getAddressComponent('country').long_name;
          const postalCode = getAddressComponent('postal_code').long_name;

          this.setState({
            address: addressInput.value,
            streetNumber,
            route,
            city,
            province,
            country,
            postalCode,
            coords: {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            },
          });
        });
      }
    }
  }

  componentWillUnmount() {
    // Cleanup the autocomplete container.
    const autocompleteNode = document.querySelector('.pac-container');
    if (autocompleteNode) {
      document.body.removeChild(autocompleteNode);
    }
  }

  _onNameChanged(event) {
    this.setState({name: event.target.value});
  }

  _onAddressChanged(event) {
    this.setState({address: event.target.value});
  }

  _onSubmit(event) {
    event.preventDefault();
    if (this.props.onLocationAdded) {
      this.props.onLocationAdded.call(null, {
        name: this.state.name,
        formattedAddress: this.state.address,
        coords: this.state.coords,
        streetNumber: this.state.streetNumber,
        route: this.state.route,
        city: this.state.city,
        province: this.state.province,
        country: this.state.country,
        postalCode: this.state.postalCode,
      });
    }

    this.setState({
      name: '',
      address: '',
      coords: null,
      streetNumber: '',
      route: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
    });
  }

  _onCancel(event) {
    if (event) {
      event.preventDefault();
    }

    if (this.props.onCancel) {
      this.props.onCancel.call(null);
    }

    this.setState({
      name: '',
      address: '',
      coords: null,
      streetNumber: '',
      route: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
    });
  }

  render() {
    return (
      <Dialog
        opened={this.props.opened}
        onClose={::this._onCancel}>
        <form onSubmit={::this._onSubmit}>
          <div styleName="add-location-dialog-view">
            <h2>Add a location</h2>
            <input
              type="text"
              required
              value={this.state.name}
              onChange={::this._onNameChanged}
              placeholder="Name" />
            <input
              type="text"
              required
              value={this.state.address}
              onChange={::this._onAddressChanged}
              placeholder="Address"
              ref="address"
            />
            <div className="btn-group dialog-buttons">
              <button onClick={::this._onCancel}>Cancel</button>
              <button type="submit" className="primary">Ok</button>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}
