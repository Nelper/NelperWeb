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
  addBankAccount,
} from '../data/paymentData';

import {
  TaskType,
  LocationInputType,
  UserPrivateType,
} from './types';

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

export const SetExternalAccountMutation = mutationWithClientMutationId({
  name: 'SetExternalAccount',
  inputFields: {
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    token: {type: GraphQLString},
    birthday: {type: GraphQLString},
    address: {type: LocationInputType},
  },
  outputFields: {
    privateData: {
      type: UserPrivateType,
      resolve: ({privateData}) => {
        return privateData;
      },
    },
  },
  mutateAndGetPayload: async ({firstName, lastName, address, birthday, token}, {rootValue}) => {
    const privateData = await addBankAccount(rootValue, token, {
      firstName,
      lastName,
      address,
      birthday,
    });
    return {privateData};
  },
});
