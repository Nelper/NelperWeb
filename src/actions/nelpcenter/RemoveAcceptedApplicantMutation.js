import Relay, {Mutation} from 'react-relay';

export default class RemoveAcceptedApplicantMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
        acceptedApplication {
          id,
        },
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
          state,
          acceptedApplication,
          applications,
          userPrivate,
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
        application: this.props.task.acceptedApplication.id,
      },
    }];
  }
  getVariables() {
    return {
      taskId: this.props.task.id,
      applicationId: this.props.task.acceptedApplication.id,
      state: 'PENDING',
    };
  }
  getOptimisticResponse() {
    return {
      task: {
        id: this.props.task.id,
        acceptedApplication: null,
        state: 'PENDING',
      },
      application: {
        id: this.props.task.acceptedApplication.id,
        state: 'PENDING',
      },
    };
  }
}
