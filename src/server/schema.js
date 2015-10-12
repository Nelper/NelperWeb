import Parse from 'parse/node';

import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import {nodeField} from './nodeResolver';

import {
  UserType,
  BrowseType,
} from './schema/types';

import {
  ApplyForTaskMutation,
  CancelApplyForTaskMutation,
  ChangeLanguageMutation,
  UpdateNotificationSettingsMutation,
  EditTaskMutation,
  SetApplicationStateMutation,
  DeleteTaskMutation,
  SendPaymentMutation,
  CreateStripeAccountMutation,
  PostTaskMutation,
  EditLocationsMutation,
  EditProfileMutation,
} from './schema/mutations';

import {getMe} from './data/userData';

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: async (ctx) => {
        let user = await getMe(ctx);
        if (!user) {
          user = new Parse.Object();
          user.logged = false;
          return user;
        }

        user.logged = true;
        return user;
      },
    },
    browse: {
      type: BrowseType,
      resolve: ctx => ctx,
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    postTask: PostTaskMutation,
    editTask: EditTaskMutation,
    deleteTask: DeleteTaskMutation,
    applyForTask: ApplyForTaskMutation,
    cancelApplyForTask: CancelApplyForTaskMutation,
    setApplicationState: SetApplicationStateMutation,

    editProfile: EditProfileMutation,

    editLocations: EditLocationsMutation,
    updateNotificationSettings: UpdateNotificationSettingsMutation,
    changeLanguage: ChangeLanguageMutation,

    sendPayment: SendPaymentMutation,
    createStripeAccount: CreateStripeAccountMutation,
  }),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
