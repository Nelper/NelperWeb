import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';
import InputElement from 'react-input-mask';

import PaymentUtils from 'utils/PaymentUtils';

import styles from './NelperPaySettingsHandler.scss';

@cssModules(styles)
class AccountSettingsHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const {user} = this.props;
    const {bankAccount} = user.privateData;
    this.state = {
      firstName: bankAccount && bankAccount.identity.firstName || user.firstName,
      lastName: bankAccount && bankAccount.identity.lastName || user.lastName,
      location: null,
      birthday: '',
      bankTransit: '',
      institutionNumber: '',
      accountNumber: '',
      stripe: PaymentUtils.get(),
    };
  }

  componentDidMount() {
    if (!PaymentUtils.get()) {
      PaymentUtils.load().then(stripe => {
        this.setState({stripe});
      });
    }
  }

  _onFirstNameChange(event) {
    this.setState({firstName: event.target.value});
  }

  _onLastNameChange(event) {
    this.setState({lastName: event.target.value});
  }

  _onBirthdayChange(event) {
    this.setState({birthday: event.target.value});
  }

  _onBankTransitChange(event) {
    this.setState({bankTransit: event.target.value});
  }

  _onInstitutionNumberChange(event) {
    this.setState({institutionNumber: event.target.value});
  }

  _onAccountNumberChange(event) {
    this.setState({accountNumber: event.target.value});
  }

  _onLocationChange(event) {
    if (event.target.value === -1) {
      this.setState({location: null});
    } else {
      this.setState({location: this.props.user.privateData.locations[event.target.value]});
    }
  }

  _onAddBackAccount() {
    const {
      firstName,
      lastName,
      birthday,
      location,
      bankTransit,
      institutionNumber,
      accountNumber,
      stripe,
    } = this.state;

    const routingNumber = bankTransit + '-' + institutionNumber;

    if (!firstName.length) {
      console.log('firstName');
      return;
    }
    if (!lastName.length) {
      console.log('lastName');
      return;
    }
    if (!birthday.length) {
      console.log('birthday');
      return;
    }
    if (!location) {
      console.log('location');
      return;
    }
    if (!stripe.bankAccount.validateRoutingNumber(routingNumber, 'CA')) {
      console.log('validateRoutingNumber');
      return;
    }
    if (!stripe.bankAccount.validateAccountNumber(accountNumber, 'CA')) {
      console.log('validateAccountNumber');
      return;
    }

    this.state.stripe.bankAccount.createToken({
      country: 'CA',
      currency: 'cad',
      routing_number: routingNumber,
      account_number: this.state.accountNumber,
    })
    .then((resp) => {

    });
  }

  render() {
    if (!this.state.stripe) {
      return null;
    }
    const {user} = this.props;
    const locations = user.privateData.locations.map((l, i) => {
      return (
        <option value={i} key={i}>{l.name}</option>
      );
    });

    return (
      <div className="settings-handler container">
        <div className="panel">
          <div className="panel-title">
            <h2>
              <FormattedMessage id="settings.nelperpay.creditCards" />
            </h2>
          </div>
          <div className="panel-content">
            <form>
              First name
              <input value={this.state.firstName} onChange={::this._onFirstNameChange} />
              Last name
              <input value={this.state.lastName} onChange={::this._onLastNameChange} />
              Date of birth
              <InputElement
                type="text"
                mask="99 / 99 / 9999"
                maskChar="_"
                placeholder="mm / dd / yyyy"
                value={this.state.birthday}
                onChange={::this._onBirthdayChange}
              />
              Address
              <select value={user.privateData.locations.indexOf(this.state.location)} onChange={::this._onLocationChange}>
                <option key={-1} value={-1}>Choose an address</option>
                {locations}
              </select>
              Bank transit
              <input value={this.state.bankTransit} onChange={::this._onBankTransitChange} />
              Institution number
              <input value={this.state.institutionNumber} onChange={::this._onInstitutionNumberChange} />
              Account number
              <input value={this.state.accountNumber} onChange={::this._onAccountNumberChange} />
            </form>
            <button className="primary" onClick={::this._onAddBackAccount}>Add bank account</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(AccountSettingsHandler, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        firstName,
        lastName,
        privateData {
          locations {
            name,
            streetNumber,
            route,
            city,
            province,
            country,
            postalCode,
          },
          bankAccount {
            identity {
              firstName,
              lastName,
              birthday,
              address {
                streetNumber,
                route,
                city,
                province,
                country,
                postalCode,
              },
            },
            stripeId,
          }
        }
      }
    `,
  },
});
