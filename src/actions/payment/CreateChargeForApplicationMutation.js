import Relay, {Mutation} from 'react-relay';

export default class CreateChargeForApplicationMutation extends Mutation {
  static fragments = {
    application: () => Relay.QL`
      fragment on Application {
        id,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{createChargeForApplication}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateChargeForApplicationPayload {
        success,
      }
    `;
  }

  getVariables() {
    return {
      applicationId: this.props.application.id,
      token: this.props.token,
    };
  }
}
