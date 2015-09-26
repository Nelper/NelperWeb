import {
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  TaskType,
  UserType,
  FileInputType,
} from './types';

import {
  getTask,
  editTask,
  applyForTask,
  cancelApplyForTask,
  deleteTask,
} from '../data/taskData';

import {
  getMe,
} from '../data/userData';

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

export const DeleteTaskMutation = mutationWithClientMutationId({
  name: 'DeleteTask',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
  },
  outputFields: {
    deletedTaskId: {
      type: GraphQLID,
      resolve: ({id}) => {
        return id;
      },
    },
    me: {
      type: UserType,
      resolve: ({localTaskId}, _, {rootValue}) => {
        return getMe(rootValue);
      },
    },
  },
  mutateAndGetPayload: async ({id}, {rootValue}) => {
    const localTaskId = fromGlobalId(id).id;
    await deleteTask(rootValue, localTaskId);
    return {id};
  },
});
