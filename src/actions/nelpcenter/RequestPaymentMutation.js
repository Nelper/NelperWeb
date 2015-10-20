import Relay, {Mutation} from 'react-relay';

export default class RequestPaymentMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{requestPayment}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RequestPaymentPayload {
        task {
          completionState,
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
    };
  }
  getOptimisticResponse() {
    return {
      task: {
        taskId: this.props.task.id,
        completionState: 'PAYMENT_REQUESTED',
      },
    };
  }
}
