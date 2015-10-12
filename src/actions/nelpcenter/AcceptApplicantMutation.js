import Relay, {Mutation} from 'react-relay';

export default class AcceptApplicantMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
      }
    `,
    application: () => Relay.QL`
      fragment on Application {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{setApplicationState}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on SetApplicationStatePayload {
        task {
          acceptedApplication,
          applications,
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
      applicationId: this.props.application.id,
      state: 'ACCEPTED',
    };
  }
  getOptimisticResponse() {
    return {
      task: {
        id: this.props.task.id,
        acceptedApplication: this.props.application,
      },
    };
  }
}
