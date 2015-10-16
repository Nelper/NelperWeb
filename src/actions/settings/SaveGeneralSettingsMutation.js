import Relay, {Mutation} from 'react-relay';

export default class SaveGeneralSettingsMutation extends Mutation {
  static fragments = {
    privateData: () => Relay.QL`
      fragment on UserPrivate {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{saveGeneralSettings}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on SaveGeneralSettingsPayload {
        privateData {
          email,
          phone,
          language,
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
      email: this.props.email,
      phone: this.props.phone,
      language: this.props.language,
    };
  }
}
