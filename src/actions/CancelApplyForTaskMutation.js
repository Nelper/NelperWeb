import Relay, {Mutation} from 'react-relay';

export default class CancelApplyForTaskMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{cancelApplyForTask}`;
  }
  getCollisionKey() {
    return `check_${this.props.task.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CancelApplyForTaskPayload {
        task {
          application {
            state,
          }
        }
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
      id: this.props.task.id,
    };
  }
  getOptimisticResponse() {
    return {
      task: {
        application: null,
      },
    };
  }
}
