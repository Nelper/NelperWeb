import Relay, {Mutation} from 'react-relay';

export default class DeleteLocationMutation extends Mutation {
  static fragments = {
    privateData: () => Relay.QL`
      fragment on UserPrivate {
        id,
        locations {
          name,
          formattedAddress,
          streetNumber,
          route,
          city,
          province,
          country,
          postalCode,
          coords {
            latitude,
            longitude,
          },
        },
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
    const locations = [...this.props.privateData.locations];
    locations.splice(this.props.index, 1);
    return {
      locations: locations.map(l => ({
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
    const locations = [...this.props.privateData.locations];
    locations.splice(this.props.index, 1);
    return {
      privateData: {
        id: this.props.privateData.id,
        locations: locations,
      },
    };
  }
}
