import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLFloat,
} from 'graphql';

export const GeoPointType = new GraphQLObjectType({
  name: 'GeoPoint',
  description: 'A geo point',
  fields: () => ({
    latitude: {
      type: GraphQLFloat,
      description: 'The latitude of the point.',
      resolve: (point) => point.latitude,
    },
    longitude: {
      type: GraphQLFloat,
      description: 'The longitude of the point.',
      resolve: (point) => point.longitude,
    },
  }),
});

export const GeoPointInputType = new GraphQLInputObjectType({
  name: 'GeoPointInput',
  description: 'A geo point unput',
  fields: () => ({
    latitude: {
      type: GraphQLFloat,
      description: 'The latitude of the point.',
      defaultValue: 0,
    },
    longitude: {
      type: GraphQLFloat,
      description: 'The longitude of the point.',
      defaultValue: 0,
    },
  }),
});
