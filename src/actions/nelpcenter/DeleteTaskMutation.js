import Relay, {Mutation} from 'react-relay';

export default class DeleteTaskMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
        user {
          id,
        }
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{deleteTask}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteTaskPayload {
        deletedTaskId,
        me {
          tasks,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'me',
      parentID: this.props.task.user.id,
      connectionName: 'tasks',
      deletedIDFieldName: 'deletedTaskId',
    }];
  }
  getVariables() {
    return {
      id: this.props.task.id,
    };
  }
}
