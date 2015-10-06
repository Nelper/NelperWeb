import Relay, {Mutation} from 'react-relay';

export default class EditSkillsMutation extends Mutation {
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
          skills,
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
      skills: this.props.skills.map(s => ({title: s.title})),
    };
  }
  getOptimisticResponse() {
    const {me} = this.props;
    me.skills = this.props.skills;
    return {
      me,
    };
  }
}
