import {
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionFromArray,
} from 'graphql-relay';

import {
  TaskConnectionType,
  GeoPointInputType,
} from './types';

import {findTasks} from '../data/taskData';

export const browseArgs = {
  sort: {
    type: new GraphQLEnumType({
      name: 'BrowseTaskSort',
      values: {
        DISTANCE: {value: 0},
        PRICE: {value: 1},
        DATE: {value: 2},
      },
    }),
    description: 'The tasks sort order',
  },
  maxDistance: {
    type: GraphQLInt,
    description: 'Only show tasks that are withing $maxDistance. Must specify the $location param.',
  },
  minPrice: {
    type: GraphQLInt,
    description: 'Only show task that have a price higher than $minPrice',
  },
  categories: {
    type: new GraphQLList(GraphQLString),
    description: 'Only show tasks with a category contained in $categories',
  },
  location: {
    type: GeoPointInputType,
    description: 'The user current location. Required for distance $sort and $maxDistance',
  },
};

export const BrowseType = new GraphQLObjectType({
  name: 'Browse',
  fields: () => ({
    tasks: {
      args: {
        ...browseArgs,
        ...connectionArgs,
      },
      type: TaskConnectionType,
      resolve: async (_, args, {rootValue}) => {
        const tasks = await findTasks(rootValue, args);
        return connectionFromArray(tasks, args);
      },
    },
  }),
});
