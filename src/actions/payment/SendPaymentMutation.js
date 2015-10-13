import Relay, {Mutation} from 'react-relay';

export default class SendPaymentMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{sendPayment}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on SendPaymentPayload {
        paymentStatus,
        task {
          completionState,
          paymentSentAt,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        task: this.props.task.id,
      },
    }];
  }
  getVariables() {
    return {
      taskId: this.props.task.id,
      token: this.props.token,
    };
  }
}
