import Relay, {Mutation} from 'react-relay';

export default class CompleteTaskMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{completeTask}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CompleteTaskPayload {
        task {
          completionState,
        },
        me {
          tasksCompleted,
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
        completionState: 'COMPLETED',
      },
    };
  }
}
