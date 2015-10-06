import Relay, {Mutation} from 'react-relay';

export default class EditAboutMutation extends Mutation {
  static fragments = {
    me: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{editProfile}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on EditProfilePayload {
        me {
          about,
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        me: this.props.me.id,
      },
    }];
  }
  getVariables() {
    return {
      about: this.props.about,
    };
  }
  getOptimisticResponse() {
    const {me} = this.props;
    me.about = this.props.about;
    return {
      me,
    };
  }
}
