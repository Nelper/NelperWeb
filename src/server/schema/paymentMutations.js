import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
} from 'graphql';

import {
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import {
  sendPaymentForTask,
  createStripeAccount,
} from '../data/paymentData';

import {TaskType} from './types';

const PaymentStatusType = new GraphQLEnumType({
  name: 'PaymentStatus',
  description: 'The possible states for a task.',
  values: {
    SUCCESS: {value: 0},
    FAILED: {value: 1},
  },
});

export const SendPaymentMutation = mutationWithClientMutationId({
  name: 'SendPayment',
  inputFields: {
    taskId: {type: new GraphQLNonNull(GraphQLID)},
    token: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    paymentStatus: {
      type: PaymentStatusType,
      resolve: ({paymentStatus}) => {
        return paymentStatus;
      },
    },
    task: {
      type: TaskType,
      resolve: ({task}) => {
        return task;
      },
    },
  },
  mutateAndGetPayload: async ({taskId, token}, {rootValue}) => {
    const localTaskId = fromGlobalId(taskId).id;
    return await sendPaymentForTask(rootValue, localTaskId, token);
  },
});

export const CreateStripeAccountMutation = mutationWithClientMutationId({
  name: 'CreateStripeAccount',
  inputFields: {},
  outputFields: {
    success: {
      type: GraphQLBoolean,
      resolve: ({success}) => {
        return success;
      },
    },
  },
  mutateAndGetPayload: async (_, {rootValue}) => {
    await createStripeAccount(rootValue);
    return {success: true};
  },
});
