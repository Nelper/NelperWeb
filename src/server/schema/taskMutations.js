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
  cursorForObjectInConnection,
} from 'graphql-relay';

import {
  TaskType,
  TaskEdgeType,
  UserType,
  FileInputType,
  LocationInputType,
} from './types';

import {
  getTasksForUser,
  getTask,
  postTask,
  editTask,
  applyForTask,
  cancelApplyForTask,
  deleteTask,
} from '../data/taskData';

import {
  getMe,
} from '../data/userData';

export const PostTaskMutation = mutationWithClientMutationId({
  name: 'PostTask',
  inputFields: {
    title: {type: new GraphQLNonNull(GraphQLString)},
    category: {type: new GraphQLNonNull(GraphQLString)},
    desc: {type: new GraphQLNonNull(GraphQLString)},
    priceOffered: {type: new GraphQLNonNull(GraphQLInt)},
    location: {type: new GraphQLNonNull(LocationInputType)},
    pictures: {type: new GraphQLList(FileInputType)},
  },
  outputFields: {
    me: {
      type: UserType,
      resolve: (input, args, {rootValue}) => {
        return getMe(rootValue);
      },
    },
    newTaskEdge: {
      type: TaskEdgeType,
      resolve: async ({localTaskId}, _, {rootValue}) => {
        const tasks = await getTasksForUser(rootValue, rootValue.userId);
        const task = tasks.find(t => t.id === localTaskId);

        return {
          cursor: cursorForObjectInConnection(tasks, task),
          node: task,
        };
      },
    },
  },
  mutateAndGetPayload: async ({title, category, desc, priceOffered, location, pictures}, {rootValue}) => {
    const task = await postTask(rootValue, title, category, desc, priceOffered, location, pictures);
    return {localTaskId: task.id};
  },
});

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
