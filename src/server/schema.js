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
  SaveGeneralSettingsMutation,
  UpdateNotificationSettingsMutation,
  EditTaskMutation,
  SetApplicationStateMutation,
  DeleteTaskMutation,
  SendPaymentMutation,
  PostTaskMutation,
  EditLocationsMutation,
  EditProfileMutation,
  CompleteTaskMutation,
  SendApplicantFeedbackMutation,
  ChangePasswordMutation,
  RequestPaymentMutation,
  SetExternalAccountMutation,
  CreateAccountMutation,
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
    completeTask: CompleteTaskMutation,
    sendApplicantFeedback: SendApplicantFeedbackMutation,
    requestPayment: RequestPaymentMutation,

    editProfile: EditProfileMutation,

    editLocations: EditLocationsMutation,
    updateNotificationSettings: UpdateNotificationSettingsMutation,
    saveGeneralSettings: SaveGeneralSettingsMutation,
    changePassword: ChangePasswordMutation,
    createAccount: CreateAccountMutation,

    sendPayment: SendPaymentMutation,
    setExternalAccount: SetExternalAccountMutation,
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
