import Relay, {Mutation} from 'react-relay';

export default class EditExperienceMutation extends Mutation {
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
          experience,
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
      experience: this.props.experience.map(s => ({title: s.title})),
    };
  }
  getOptimisticResponse() {
    const {me} = this.props;
    me.experience = this.props.experience;
    return {
      me,
    };
  }
}
