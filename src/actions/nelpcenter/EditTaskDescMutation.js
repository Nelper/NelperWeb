import Relay, {Mutation} from 'react-relay';

export default class EditTaskDescMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{editTask}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on EditTaskPayload {
        task {
          desc,
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
      desc: this.props.desc,
    };
  }
  getOptimisticResponse() {
    return {
      task: {
        id: this.props.task.id,
        desc: this.props.desc,
      },
    };
  }
}
