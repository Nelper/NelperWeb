import React, {Component, PropTypes} from 'react';

import Dialog from 'components/Dialog';
import GoogleMapsUtils from 'utils/GoogleMapsUtils';

export default class FindNelpAddHandler extends Component {

  static propTypes = {
    opened: PropTypes.bool,
    onLocationAdded: PropTypes.func,
    onCancel: PropTypes.func,
  }

  state = {
    name: '',
    address: '',
    coords: '',
    city: '',
  }

  componentDidMount() {
    GoogleMapsUtils.load((maps) => {
      let addressInput = this.refs.address.getDOMNode();
      let autocomplete = new maps.places.Autocomplete(addressInput);
      maps.event.addListener(autocomplete, 'place_changed', () => {
        let place = autocomplete.getPlace();
        let comp = place.address_components.find(c => {
          return c.types.some(t => t === 'locality');
        });
        this.setState({
          address: addressInput.value,
          city: comp.long_name,
          coords: {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          },
        });
      });
    });
  }

  componentWillUnmount() {
    // Cleanup the autocomplete container.
    let autocompleteNode = document.querySelector('.pac-container');
    document.body.removeChild(autocompleteNode);
  }

  render() {
    return (
      <Dialog
        opened={this.props.opened}
        onClose={::this._onCancel}>
        <form onSubmit={::this._onSubmit}>
          <div className="add-location-dialog-view">
            <h2>Add a location</h2>
            <input
              type="text"
              required={true}
              value={this.state.name}
              onChange={::this._onNameChanged}
              placeholder="Name" />
            <input
              type="text"
              required={true}
              value={this.state.address}
              onChange={::this._onAddressChanged}
              placeholder="Address"
              ref="address" />
            <div className="btn-group dialog-buttons">
              <button onClick={::this._onCancel}>Cancel</button>
              <button type="submit" className="primary">Ok</button>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }

  _onNameChanged(event) {
    this.setState({name: event.target.value});
  }

  _onAddressChanged(event) {
    this.setState({address: event.target.value});
  }

  _onSubmit(event) {
    event.preventDefault();
    if(this.props.onLocationAdded) {
      this.props.onLocationAdded.call(null, {
        name: this.state.name,
        address: this.state.address,
        coords: this.state.coords,
        city: this.state.city,
      });
    }
    this.setState({
      name: '',
      address: '',
      coords: null,
      city: '',
    });
  }

  _onCancel(event) {
    if(event) {
      event.preventDefault();
    }
    if(this.props.onCancel) {
      this.props.onCancel.call(null);
    }
    this.setState({
      name: '',
      address: '',
      coords: null,
      city: '',
    });
  }
}
