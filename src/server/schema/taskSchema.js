import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {
  nodeInterface,
  addResolver,
} from '../nodeResolver';

import {
  UserType,
  ApplicationType,
  FileType,
  GeoPointType,
} from './index';

import {getTask} from '../data/taskData';

export const TaskType = new GraphQLObjectType({
  name: 'Task',
  description: 'A task on Nelper',
  fields: () => ({
    id: globalIdField('Task'),
    createdAt: {
      type: GraphQLString,
      description: 'Task created at date',
      resolve: (task) => task.get('createdAt').toJSON(),
    },
    title: {
      type: GraphQLString,
      description: 'The task title',
      resolve: (task) => task.get('title'),
    },
    desc: {
      type: GraphQLString,
      description: 'The task description',
      resolve: (task) => task.get('desc'),
    },
    category: {
      type: GraphQLString,
      description: 'The task category',
      resolve: (task) => task.get('category'),
    },
    city: {
      type: GraphQLString,
      description: 'The task city',
      resolve: (task) => task.get('city'),
    },
    location: {
      type: GeoPointType,
      description: 'The task approximate geo point',
      resolve: (task) => task.get('location'),
    },
    pictures: {
      type: new GraphQLList(FileType),
      description: 'The task pictures',
      resolve: (task) => task.get('pictures'),
    },
    priceOffered: {
      type: GraphQLInt,
      description: 'The task price offered',
      resolve: (task) => task.get('priceOffered'),
    },
    user: {
      type: UserType,
      description: 'The user that created the task',
      resolve: (task) => task.get('user'),
    },
    application: {
      type: ApplicationType,
      description: 'The user\'s application on the task. Only available in browse',
      resolve: (task) => task.get('application'),
    },
  }),
  interfaces: [nodeInterface],
});

const taskConnectionDefinition = connectionDefinitions({
  name: 'Task',
  nodeType: TaskType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      resolve: (conn) => conn.edges.length,
    },
  }),
});

export const TaskConnectionType = taskConnectionDefinition.connectionType;

addResolver(
  async (type, id, {rootValue}) => {
    if (type === 'Task') {
      return await getTask(rootValue, id);
    }
    return null;
  }, (obj) => {
    if (obj.className && obj.className === 'NelpTask') {
      return TaskType;
    }
    return null;
  },
);
