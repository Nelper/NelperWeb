import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  sendPaymentForTask,
  createStripeAccount,
} from '../data/paymentData';

const PaymentStatusType = new GraphQLEnumType({
  name: 'PaymentStatus',
  description: 'The possible states for a task.',
  values: {
    SUCCESS: {value: 0},
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
      resolve: ({status}) => {
        return status;
      },
    },
  },
  mutateAndGetPayload: async ({taskId, token}, {rootValue}) => {
    const status = await sendPaymentForTask(rootValue, taskId, token);
    return {status};
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
