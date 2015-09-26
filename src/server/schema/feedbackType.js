import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {
  UserType,
  TaskType,
} from './types';

import commonFields from './commonFields';

export const FeedbackType = new GraphQLObjectType({
  name: 'Feedback',
  description: 'A user feedback',
  fields: () => ({
    id: globalIdField('Feedback'),
    ...commonFields,
    rating: {
      type: GraphQLInt,
      description: 'The feedback rating.',
      resolve: (feedback) => feedback.get('rating'),
    },
    content: {
      type: GraphQLString,
      description: 'The feedback content.',
      resolve: (feedback) => feedback.get('content'),
    },
    user: {
      type: UserType,
      description: 'The user the feedback is for.',
      resolve: (feedback) => feedback.get('user'),
    },
    poster: {
      type: UserType,
      description: 'The author of the feedback.',
      resolve: (feedback) => feedback.get('poster'),
    },
    task: {
      type: TaskType,
      description: 'The task the feedback is for.',
      resolve: (feedback) => feedback.get('task'),
    },
  }),
});

const feedbackConnectionDefinition = connectionDefinitions({
  name: 'Feedback',
  nodeType: FeedbackType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      resolve: (conn) => conn.edges.length,
    },
  }),
});

export const FeedbackConnectionType = feedbackConnectionDefinition.connectionType;
