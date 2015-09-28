import Parse from 'parse/node';

import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import {nodeField} from './nodeResolver';

import {UnauthorizedError} from './errors';

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
  CreateChargeForApplicationMutation,
  CreateStripeAccountMutation,
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
    editTask: EditTaskMutation,
    applyForTask: ApplyForTaskMutation,
    cancelApplyForTask: CancelApplyForTaskMutation,
    updateNotificationSettings: UpdateNotificationSettingsMutation,
    changeLanguage: ChangeLanguageMutation,
    setApplicationState: SetApplicationStateMutation,
    deleteTask: DeleteTaskMutation,
    createChargeForApplication: CreateChargeForApplicationMutation,
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
