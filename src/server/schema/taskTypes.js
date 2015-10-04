import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLEnumType,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
  connectionFromArray,
} from 'graphql-relay';

import {
  nodeInterface,
  addResolver,
} from '../nodeResolver';

import {
  UserType,
  ApplicationType,
  ApplicationConnectionType,
  FileType,
  GeoPointType,
  LocationType,
} from './types';

import {
  getTask,
} from '../data/taskData';

import {
  getTaskPosterPrivate,
} from '../data/userData';

import commonFields from './commonFields';

const TaskPosterUserPrivateType = new GraphQLObjectType({
  name: 'TaskPosterUserPrivate',
  description: 'Private info about the task poster.',
  fields: () => ({
    phone: {
      type: GraphQLString,
      description: 'The task poster phone number.',
    },
    email: {
      type: GraphQLString,
      description: 'The task poster email.',
    },
    exactLocation: {
      type: LocationType,
      description: 'The exact location of the task',
    },
  }),
});

export const TaskStateType = new GraphQLEnumType({
  name: 'TaskState',
  description: 'The possible states for a task.',
  values: {
    PENDING: {value: 0},
    ACCEPTED: {value: 1},
    DELETED: {value: 2},
    COMPLETED: {value: 3},
  },
});

export const TaskCompletionStateType = new GraphQLEnumType({
  name: 'TaskCompletionState',
  description: 'The progress of a task once accepted.',
  values: {
    ACCEPTED: {value: 0},
    PAYMENT_SENT: {value: 1},
    COMPLETED: {value: 2},
    RATED: {value: 3},
  },
});

export const TaskType = new GraphQLObjectType({
  name: 'Task',
  description: 'A task on Nelper',
  fields: () => ({
    id: globalIdField('Task'),
    ...commonFields,
    state: {
      type: TaskStateType,
      resolve: (task) => task.get('state'),
    },
    completionState: {
      type: TaskCompletionStateType,
      resolve: (task) => task.get('completionState'),
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
    applications: {
      type: ApplicationConnectionType,
      description: 'All the applications on the task. Only available in me',
      resolve: async (task, args) => {
        if (!task.get('applications')) {
          return null;
        }
        const applications = await task.get('applications');
        return connectionFromArray(applications, args);
      },
    },
    userPrivate: {
      type: TaskPosterUserPrivateType,
      description: 'The private info about the task poster. Only available to the accepted Nelper.',
      resolve: (task, _, {rootValue}) => getTaskPosterPrivate(rootValue, task),
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
export const TaskEdgeType = taskConnectionDefinition.edgeType;

addResolver(
  async (type, id, {rootValue}) => {
    if (type === 'Task') {
      return await getTask(rootValue, id, true);
    }
    return null;
  }, (obj) => {
    if (obj.className && obj.className === 'NelpTask') {
      return TaskType;
    }
    return null;
  },
);
