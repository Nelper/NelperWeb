import Relay, {Mutation} from 'react-relay';

export default class ChangeLanguageMutation extends Mutation {
  static fragments = {
    privateData: () => Relay.QL`
      fragment on UserPrivate {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{changeLanguage}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ChangeLanguagePayload {
        privateData {
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
      language: this.props.language,
    };
  }
}
