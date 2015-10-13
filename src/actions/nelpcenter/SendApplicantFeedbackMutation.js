import Relay, {Mutation} from 'react-relay';

export default class SendApplicantFeedbackMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{sendApplicantFeedback}`;
  }
  getFatQuery() {
    // TODO: We may want to invalidate the user that has been rated too.
    return Relay.QL`
      fragment on SendApplicantFeedbackPayload {
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
      rating: this.props.rating,
      content: this.props.content,
    };
  }
  getOptimisticResponse() {
    return {
      task: {
        taskId: this.props.task.id,
        completionState: 'RATED',
      },
    };
  }
}
