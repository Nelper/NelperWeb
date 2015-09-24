import {
  GraphQLString,
} from 'graphql';

export default {
  objectId: {
    type: GraphQLString,
    description: 'The id of the object on Parse. For compatibility purposes only, will be deprecated.',
    resolve: (obj) => obj.id,
  },
  createdAt: {
    type: GraphQLString,
    description: 'The date the object was created.',
    resolve: (obj) => obj.get('createdAt').toJSON(),
  },
  updatedAt: {
    type: GraphQLString,
    description: 'The date the object was last updated',
    resolve: (obj) => obj.get('updatedAt').toJSON(),
  },
};
