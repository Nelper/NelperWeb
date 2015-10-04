import Relay, {Mutation} from 'react-relay';

export default class PostTaskMutation extends Mutation {
  static fragments = {
    me: () => Relay.QL`fragment on User { id }`,
  };
  getMutation() {
    return Relay.QL`mutation{postTask}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on PostTaskPayload {
        me {
          tasks,
        },
        newTaskEdge,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'tasks',
      edgeName: 'newTaskEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }];
  }
  getVariables() {
    const {location, pictures} = this.props.task;
    return {
      title: this.props.task.title,
      category: this.props.task.category,
      desc: this.props.task.desc,
      priceOffered: this.props.task.priceOffered,
      location: {
        streetNumber: location.streetNumber,
        route: location.route,
        city: location.city,
        province: location.province,
        country: location.country,
        postalCode: location.postalCode,
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      },
      pictures: pictures.map(p => ({
        name: p.name,
        url: p.url,
      })),
    };
  }
}
