import Relay, {Mutation} from 'react-relay';

export default class ChangePasswordMutation extends Mutation {
  getMutation() {
    return Relay.QL`mutation{changePassword{error}}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ChangePasswordPayload {
        error,
      }
    `;
  }
  getConfigs() {
    return [];
  }
  getVariables() {
    return {
      currentPassword: this.props.currentPassword,
      newPassword: this.props.newPassword,
    };
  }
}
