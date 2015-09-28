import Relay, {Mutation} from 'react-relay';

export default class CreateStripeAccountMutation extends Mutation {
  getMutation() {
    return Relay.QL`mutation{createStripeAccount}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateStripeAccountPayload {
        success,
      }
    `;
  }
}
