import Relay, {Mutation} from 'react-relay';

export default class RestoreApplicantMutation extends Mutation {
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
          applications,
        },
        application {
          state,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        task: this.props.task.id,
        application: this.props.application.id,
      },
    }];
  }
  getVariables() {
    return {
      taskId: this.props.task.id,
      applicationId: this.props.application.id,
      state: 'PENDING',
    };
  }
  getOptimisticResponse() {
    return {
      application: {
        id: this.props.application.id,
        state: 'PENDING',
      },
    };
  }
}
