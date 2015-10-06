import Relay, {Mutation} from 'react-relay';

export default class EditProfilePictureMutation extends Mutation {
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
          pictureURL,
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
      picture: {
        name: this.props.picture.name,
        url: this.props.picture.url,
      },
    };
  }
}
