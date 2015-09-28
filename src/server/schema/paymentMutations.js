import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  createChargeForApplication,
  createStripeAccount,
} from '../data/paymentData';

export const CreateChargeForApplicationMutation = mutationWithClientMutationId({
  name: 'CreateChargeForApplication',
  inputFields: {
    applicationId: {type: new GraphQLNonNull(GraphQLID)},
    token: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    success: {
      type: GraphQLBoolean,
      resolve: ({success}) => {
        return success;
      },
    },
  },
  mutateAndGetPayload: async ({applicationId, token}, {rootValue}) => {
    await createChargeForApplication(rootValue, applicationId, token);
    return {success: true};
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
