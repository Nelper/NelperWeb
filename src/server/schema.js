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
      resolve: (ctx) => getMe(ctx),
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
