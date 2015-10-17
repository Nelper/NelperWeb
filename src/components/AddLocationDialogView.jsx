import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';

import {Dialog, ValidatorInput} from 'components/index';
import GoogleMapsUtils from 'utils/GoogleMapsUtils';

import styles from './AddLocationDialogView.scss';

@cssModules(styles)
export default class AddLocationDialogView extends Component {

  static propTypes = {
    opened: PropTypes.bool,
    location: PropTypes.object,
    onLocationAdded: PropTypes.func,
    onCancel: PropTypes.func,
  }

  state = {
    name: '',
    nameError: null,
    address: '',
    addressError: null,
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

  componentWillReceiveProps(newProps) {
    if (!this.props.location && newProps.location) {
      this.setState({
        name: newProps.location.name,
        address: newProps.location.formattedAddress,
      });
    } else {

    }
  }

  componentDidUpdate() {
    const maps = this.state.googleMaps;
    if (maps && !this._initializedAutocomplete) {
      const addressInput = this.refs.address && this.refs.address.getInput();
      if (addressInput) {
        this._initializedAutocomplete = true;
        const autocomplete = new maps.places.Autocomplete(addressInput, {
          types: ['address'],
        });
        maps.event.addListener(autocomplete, 'place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place || !place.address_components) {
            return;
          }

          function getAddressComponent(id) {
            return place.address_components.find(c => {
              return c.types.some(t => t === id);
            }) || {};
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
    this.setState({
      name: event.target.value,
      nameError: null,
    });
  }

  _onAddressChanged(event) {
    this.setState({
      address: event.target.value,
      addressError: null,
    });
  }

  _onSubmit(event) {
    event.preventDefault();

    const {
      name,
      address,
      coords,
      streetNumber,
      route,
      city,
      province,
      country,
      postalCode,
    } = this.state;

    // TODO: TRANSLATION
    if (!name) {
      this.setState({nameError: 'Please enter a name to indentify your address.'});
      return;
    }
    if (!streetNumber) {
      this.setState({addressError: 'Please include your street number in the address.'});
      return;
    }
    if (!route) {
      this.setState({addressError: 'Please include your street name in the address.'});
      return;
    }
    if (!city) {
      this.setState({addressError: 'Please include your city in the address.'});
      return;
    }
    if (!postalCode) {
      this.setState({addressError: 'Please include your postal code in the address.'});
      return;
    }

    if (this.props.onLocationAdded) {
      this.props.onLocationAdded.call(null, {
        name,
        coords,
        streetNumber,
        route,
        city,
        province,
        country,
        postalCode,
        formattedAddress: address,
      });
    }

    this._resetAddress();
  }

  _onCancel(event) {
    if (event) {
      event.preventDefault();
    }

    if (this.props.onCancel) {
      this.props.onCancel.call(null);
    }

    this._resetAddress();
  }

  _resetAddress() {
    this.setState({
      name: '',
      nameError: null,
      address: '',
      addressError: null,
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
        fill
        opened={this.props.opened}
        onClose={::this._onCancel}
        className="pad-all"
      >
        <form onSubmit={::this._onSubmit}>
          <div styleName="add-location-dialog-view">
            <h2>Add a location</h2>
            <ValidatorInput
              type="text"
              required
              value={this.state.name}
              onChange={::this._onNameChanged}
              placeholder="Name"
              error={this.state.nameError}
            />
            <ValidatorInput
              type="text"
              required
              value={this.state.address}
              onChange={::this._onAddressChanged}
              placeholder="Address"
              ref="address"
              error={this.state.addressError}
            />
          </div>
        </form>
        <div className="btn-group dialog-buttons">
          <button onClick={::this._onCancel}>Cancel</button>
          <button className="primary" onClick={::this._onSubmit}>Ok</button>
        </div>
      </Dialog>
    );
  }
}
