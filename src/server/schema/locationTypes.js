import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import {GeoPointType, GeoPointInputType} from './types';

export const LocationType = new GraphQLObjectType({
  name: 'Location',
  description: 'A user saved location.',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The location name.',
    },
    formattedAddress: {
      type: GraphQLString,
      description: 'The full address formatted.',
    },
    streetNumber: {
      type: GraphQLString,
      description: 'The door number.',
    },
    route: {
      type: GraphQLString,
      description: 'The street name.',
    },
    city: {
      type: GraphQLString,
      description: 'The city.',
    },
    province: {
      type: GraphQLString,
      description: 'The province.',
    },
    country: {
      type: GraphQLString,
      description: 'The country.',
    },
    postalCode: {
      type: GraphQLString,
      description: 'The postal code.',
    },
    coords: {
      type: GeoPointType,
      description: 'The map coordinates.',
    },
  }),
});

export const LocationInputType = new GraphQLInputObjectType({
  name: 'LocationInput',
  description: 'A user location input.',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The location name.',
    },
    formattedAddress: {
      type: GraphQLString,
      description: 'The full address formatted.',
    },
    streetNumber: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The door number.',
    },
    route: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The street name.',
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The city.',
    },
    province: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The province.',
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The country.',
    },
    postalCode: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The postal code.',
    },
    coords: {
      type: GeoPointInputType,
      description: 'The map coordinates.',
    },
  }),
});
