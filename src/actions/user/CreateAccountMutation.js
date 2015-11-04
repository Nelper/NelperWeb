import Relay, {Mutation} from 'react-relay';

export default class CreateAccountMutation extends Mutation {
  getMutation() {
    return Relay.QL`mutation{createAccount}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateAccountPayload {
        me {
          id,
        }
      }
    `;
  }
  getConfigs() {
    return [];
  }
  getVariables() {
    return {
      type: this.props.type,
      email: this.props.email,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      pictureURL: this.props.pictureURL,
    };
  }
}
