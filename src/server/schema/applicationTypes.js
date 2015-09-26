import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLBoolean,
  GraphQLString,
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
  getApplication,
} from '../data/applicationData';
import {getApplicantPrivate} from '../data/userData';

import {UserType, TaskType} from './types';
import commonFields from './commonFields';
import {NELP_TASK_APPLICATION_STATE} from '../../utils/constants';

export const ApplicationStateType = new GraphQLEnumType({
  name: 'ApplicationState',
  description: 'The possible states for an application',
  values: {
    PENDING: {value: 0},
    CANCELED: {value: 1},
    ACCEPTED: {value: 2},
    DENIED: {value: 3},
  },
});

export const ApplicationType = new GraphQLObjectType({
  name: 'Application',
  description: 'An application on a task',
  fields: () => ({
    id: globalIdField('Application'),
    ...commonFields,
    state: {
      type: ApplicationStateType,
      description: 'The application state',
      resolve: (application) => application.get('state'),
    },
    price: {
      type: GraphQLInt,
      description: 'The price on the application.',
      resolve: (application) => application.get('price'),
    },
    task: {
      type: TaskType,
      description: 'The task the application is on.',
      resolve: (application) => application.get('task'),
    },
    user: {
      type: UserType,
      description: 'The user that applied.',
      resolve: (application) => application.get('user'),
    },
    phone: {
      type: GraphQLString,
      description: 'The phone number of the user that applied. Accepted application only.',
      resolve: (application) => application.get('phone'),
    },
    email: {
      type: GraphQLString,
      description: 'The email of the user that applied. Accepted application only.',
      resolve: (application) => application.get('email'),
    },
  }),
  interfaces: [nodeInterface],
});

const applicationConnectionDefinition = connectionDefinitions({
  name: 'Application',
  nodeType: ApplicationType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: 'The total number of applications.',
      resolve: (conn) => conn.edges.length,
    },
    pendingCount: {
      type: GraphQLInt,
      description: 'The number of pending applications.',
      resolve: (conn) => conn.edges.filter(edge => edge.node.get('state') === NELP_TASK_APPLICATION_STATE.PENDING).length,
    },
    hasNew: {
      type: GraphQLBoolean,
      description: 'If there are applications that have not been seen by the user yet.',
      resolve: (conn) => conn.edges.some(edge => edge.node.get('isNew')),
    },
    hasAccepted: {
      type: GraphQLBoolean,
      description: 'If the is an accepted application for this task.',
      resolve: (conn) => conn.edges.some(edge => edge.node.get('state') === NELP_TASK_APPLICATION_STATE.ACCEPTED),
    },
    accepted: {
      type: ApplicationType,
      description: 'The accepted application for this task.',
      resolve: async (conn, _, {rootValue}) => {
        const acceptedEdge = conn.edges.find(edge => edge.node.get('state') === NELP_TASK_APPLICATION_STATE.ACCEPTED);
        if (acceptedEdge) {
          const application = acceptedEdge.node;
          const {phone, email} = await getApplicantPrivate(rootValue, application);
          application.set('phone', phone);
          application.set('email', email);
          return application;
        }
        return null;
      },
    },
  }),
});

export const ApplicationConnectionType = applicationConnectionDefinition.connectionType;

addResolver(
  async (type, id, {rootValue}) => {
    if (type === 'Application') {
      return await getApplication(rootValue, id);
    }
    return null;
  }, (obj) => {
    if (obj.className && obj.className === 'NelpTaskApplication') {
      return ApplicationType;
    }
    return null;
  },
);
