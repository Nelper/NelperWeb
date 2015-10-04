import Relay, {Mutation} from 'react-relay';

export default class EditLocationsMutation extends Mutation {
  static fragments = {
    privateData: () => Relay.QL`
      fragment on UserPrivate {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{editLocations}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on EditLocationsPayload {
        privateData {
          locations,
        }
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
      locations: this.props.locations.map(l => ({
        name: l.name,
        formattedAddress: l.formattedAddress,
        streetNumber: l.streetNumber,
        route: l.route,
        city: l.city,
        province: l.province,
        country: l.country,
        postalCode: l.postalCode,
        coords: {
          latitude: l.coords.latitude,
          longitude: l.coords.longitude,
        },
      })),
    };
  }
  getOptimisticResponse() {
    const {privateData} = this.props;
    privateData.locations = this.props.locations;
    return {
      privateData,
    };
  }
}
