import Relay, {Mutation} from 'react-relay';

export default class EditEducationMutation extends Mutation {
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
          education,
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
      education: this.props.education.map(s => ({title: s.title})),
    };
  }
  getOptimisticResponse() {
    const {me} = this.props;
    me.education = this.props.education;
    return {
      me,
    };
  }
}
