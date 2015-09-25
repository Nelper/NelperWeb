import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  globalIdField,
  fromGlobalId,
  connectionDefinitions,
  mutationWithClientMutationId,
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
  FileInputType,
  GeoPointType,
  LocationType,
} from './index';

import {
  getTask,
  editTask,
  applyForTask,
  cancelApplyForTask,
} from '../data/taskData';

import {getTaskPosterPrivate} from '../data/userData';

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

export const TaskType = new GraphQLObjectType({
  name: 'Task',
  description: 'A task on Nelper',
  fields: () => ({
    id: globalIdField('Task'),
    ...commonFields,
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
          throw Error('No applications. Can only get applications on the me object');
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

export const ApplyForTaskMutation = mutationWithClientMutationId({
  name: 'ApplyForTask',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    price: {type: new GraphQLNonNull(GraphQLInt)},
  },
  outputFields: {
    task: {
      type: TaskType,
      resolve: async ({localTaskId, application}, _, {rootValue}) => {
        const task = await getTask(rootValue, localTaskId);
        task.set('application', application);
        return task;
      },
    },
  },
  mutateAndGetPayload: async ({id, price}, {rootValue}) => {
    const localTaskId = fromGlobalId(id).id;
    const application = await applyForTask(rootValue, localTaskId, price);
    return {localTaskId, application};
  },
});

export const CancelApplyForTaskMutation = mutationWithClientMutationId({
  name: 'CancelApplyForTask',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
  },
  outputFields: {
    task: {
      type: TaskType,
      resolve: ({localTaskId}, _, {rootValue}) => {
        return getTask(rootValue, localTaskId);
      },
    },
  },
  mutateAndGetPayload: async ({id}, {rootValue}) => {
    const localTaskId = fromGlobalId(id).id;
    await cancelApplyForTask(rootValue, localTaskId);
    return {localTaskId};
  },
});

export const EditTaskMutation = mutationWithClientMutationId({
  name: 'EditTask',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    title: {type: GraphQLString},
    desc: {type: GraphQLString},
    pictures: {type: new GraphQLList(FileInputType)},
  },
  outputFields: {
    task: {
      type: TaskType,
      resolve: ({localTaskId}, _, {rootValue}) => {
        return getTask(rootValue, localTaskId);
      },
    },
  },
  mutateAndGetPayload: async ({id, ...fields}, {rootValue}) => {
    const localTaskId = fromGlobalId(id).id;
    await editTask(rootValue, localTaskId, fields);
    return {localTaskId};
  },
});

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
