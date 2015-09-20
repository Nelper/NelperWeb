import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLEnumType,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {
  nodeInterface,
  addResolver,
} from '../nodeResolver';

import {getApplication} from '../data/applicationData';

import {UserType} from './userSchema';
import {TaskType} from './taskSchema';
import {NELP_TASK_APPLICATION_STATE} from '../../utils/constants';

export const ApplicationType = new GraphQLObjectType({
  name: 'Application',
  description: 'An application on a task',
  fields: () => ({
    id: globalIdField('Application'),
    state: {
      type: new GraphQLEnumType({
        name: 'ApplicationState',
        description: 'The possible states for an application',
        values: {
          PENDING: {value: 0},
          CANCELED: {value: 1},
          ACCEPTED: {value: 2},
          DENIED: {value: 3},
        },
      }),
      description: 'The application state',
      resolve: (application) => application.get('state'),
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
  }),
  interfaces: [nodeInterface],
});

const applicationConnectionDefinition = connectionDefinitions({
  name: 'Application',
  nodeType: ApplicationType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      resolve: (conn) => conn.edges.length,
    },
    pendingCount: {
      type: GraphQLInt,
      resolve: (conn) => conn.edges.filter(a => a.state === NELP_TASK_APPLICATION_STATE.PENDING).length,
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
