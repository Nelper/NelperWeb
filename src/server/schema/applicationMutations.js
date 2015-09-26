import {
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import {
  setApplicationState,
} from '../data/applicationData';

import {getTask} from '../data/taskData';

import {
  TaskType,
  ApplicationType,
  ApplicationStateType,
} from './types';

export const SetApplicationStateMutation = mutationWithClientMutationId({
  name: 'SetApplicationState',
  inputFields: {
    taskId: {type: new GraphQLNonNull(GraphQLID)},
    applicationId: {type: new GraphQLNonNull(GraphQLID)},
    state: {type: ApplicationStateType},
  },
  outputFields: {
    task: {
      type: TaskType,
      resolve: ({localTaskId}, _, {rootValue}) => {
        return getTask(rootValue, localTaskId, true);
      },
    },
    application: {
      type: ApplicationType,
      resolve: ({application}) => {
        return application;
      },
    },
  },
  mutateAndGetPayload: async ({taskId, applicationId, state}, {rootValue}) => {
    const localTaskId = fromGlobalId(taskId).id;
    const localApplicationId = fromGlobalId(applicationId).id;
    const application = await setApplicationState(rootValue, localApplicationId, state);
    return {localTaskId, application};
  },
});
