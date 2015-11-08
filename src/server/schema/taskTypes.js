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
  getApplicantPrivate,
} from '../data/userData';

import {getBankTransferState} from '../data/paymentData';

import {TASK_PAYMENT_STATE} from '../data/constants';

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
    PAYMENT_REQUESTED: {value: 3},
    RATED: {value: 4},
  },
});

const TaskTransferStateType = new GraphQLEnumType({
  name: 'TaskTransferState',
  description: 'The state of a bank transfer.',
  values: {
    PENDING: {value: TASK_PAYMENT_STATE.PENDING},
    COMPLETED: {value: TASK_PAYMENT_STATE.COMPLETED},
    FAILED: {value: TASK_PAYMENT_STATE.FAILED},
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
      description: 'The state of the task.',
      resolve: (task) => task.get('state'),
    },
    completionState: {
      type: TaskCompletionStateType,
      description: 'The state of the task completion once it is accepted.',
      resolve: (task) => task.get('completionState'),
    },
    transferState: {
      type: TaskTransferStateType,
      description: 'The state of the bank transfer',
      resolve: (task, args, {rootValue}) => getBankTransferState(rootValue, task.id),
    },
    paymentSentAt: {
      type: GraphQLString,
      description: 'The date the task has been paid for.',
      resolve: (task) => task.get('paymentSentAt') && task.get('paymentSentAt').toJSON(),
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
    acceptedApplication: {
      type: ApplicationType,
      description: 'The application that has been accepted for this task.',
      resolve: async (task, _, {rootValue}) => {
        const application = task.get('acceptedApplication');
        if (application) {
          const {phone, email} = await getApplicantPrivate(rootValue, task);
          application.set('phone', phone);
          application.set('email', email);
        }
        return application;
      },
    },
    userPrivate: {
      type: TaskPosterUserPrivateType,
      description: 'The private info about the task poster. Only available to the accepted Nelper or the user that created the task.',
      resolve: (task, _, {rootValue}) => {
        if (task.get('user').id === rootValue.userId && !task.get('application')) {
          const privateData = task.get('privateData');
          return {
            exactLocation: privateData.get('location'),
          };
        }
        return getTaskPosterPrivate(rootValue, task);
      },
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
    if (obj.className && obj.className === 'Task') {
      return TaskType;
    }
    return null;
  },
);
