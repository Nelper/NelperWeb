import Relay, {Mutation} from 'react-relay';

export default class ApplyForTaskMutation extends Mutation {
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id,
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{applyForTask}`;
  }
  getCollisionKey() {
    return `check_${this.props.task.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ApplyForTaskPayload {
        task {
          application {
            state,
          }
        }
        me {
          applications,
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        task: this.props.task.id,
        me: this.props.me.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.task.id,
      price: this.props.price,
    };
  }
  getOptimisticResponse() {
    return {
      task: {
        application: {
          state: 'PENDING',
        },
      },
    };
  }
}
