import Relay, {Mutation} from 'react-relay';

export default class SetExternalAccountMutation extends Mutation {
  static fragments = {
    privateData: () => Relay.QL`
      fragment on UserPrivate {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{setExternalAccount}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on SetExternalAccountPayload {
        privateData {
          bankAccount,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        privateData: this.props.privateData.id,
      },
    }];
  }
  getVariables() {
    return {
      token: this.props.token,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      birthday: this.props.birthday,
      address: {
        streetNumber: this.props.address.streetNumber,
        route: this.props.address.route,
        city: this.props.address.city,
        province: this.props.address.province,
        country: this.props.address.country,
        postalCode: this.props.address.postalCode,
      },
    };
  }
}
