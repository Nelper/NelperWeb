import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType,
} from 'graphql';

import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
} from 'graphql-relay';

import {
  nodeInterface,
  addResolver,
} from '../nodeResolver';

import {
  getUser,
  getUserPicture,
  getUserPrivate,
  getUserFeedback,
} from '../data/userData';

import {getTasksForUser} from '../data/taskData';
import {getApplicationsForUser} from '../data/applicationData';

import {
  TaskConnectionType,
  ApplicationConnectionType,
  LocationType,
  GeoPointType,
  FeedbackConnectionType,
} from './types';

import commonFields from './commonFields';

const NotificationSettingType = new GraphQLObjectType({
  name: 'NotificationSetting',
  description: 'Settings for a notification type.',
  fields: () => ({
    email: {
      type: GraphQLBoolean,
      description: 'If the notification type should be sent by email.',
    },
  }),
});

export const NotificationSettingInputType = new GraphQLInputObjectType({
  name: 'NotificationSettingInput',
  description: 'Settings for a notification type.',
  fields: () => ({
    email: {
      type: GraphQLBoolean,
      description: 'If the notification type should be sent by email.',
      defaultValue: null,
    },
  }),
});

const NotificationType = new GraphQLObjectType({
  name: 'Notification',
  description: 'A user saved location.',
  fields: () => ({
    posterApplication: {
      type: NotificationSettingType,
      description: 'Notification setting for a task poster when a nelper applies on their task.',
    },
    posterRequestPayment: {
      type: NotificationSettingType,
      description: 'Notification setting for a task poster when a nelper requests their payment.',
    },
    nelperApplicationStatus: {
      type: NotificationSettingType,
      description: 'Notification setting for a nelper when the status of an application changes.',
    },
    nelperReceivedPayment: {
      type: NotificationSettingType,
      description: 'Notification setting for a nelper when a payment is received.',
    },
    newsletter: {
      type: NotificationSettingType,
      description: 'If the user wants to receive newsletter.',
    },
  }),
});

export const UserPrivateType = new GraphQLObjectType({
  name: 'UserPrivate',
  description: 'The user private data.',
  fields: () => ({
    id: globalIdField('UserPrivate'),
    ...commonFields,
    phone: {
      type: GraphQLString,
      description: 'The user phone number.',
      resolve: (data) => data.get('phone'),
    },
    email: {
      type: GraphQLString,
      description: 'The user email address.',
      resolve: (data) => data.get('email'),
    },
    language: {
      type: GraphQLString,
      description: 'The user current language.',
      resolve: (data) => data.get('language'),
    },
    location: {
      type: GeoPointType,
      description: 'The user location used on the map',
      resolve: (data) => data.get('location'),
    },
    locations: {
      type: new GraphQLList(LocationType),
      description: 'The user current language.',
      resolve: (data) => data.get('locations'),
    },
    notifications: {
      type: NotificationType,
      description: 'The user notifications settings',
      resolve: (data) => data.get('notifications'),
    },
  }),
  interfaces: [nodeInterface],
});

const UserSkillType = new GraphQLObjectType({
  name: 'UserSkill',
  description: 'A user skill.',
  fields: () => ({
    title: {type: GraphQLString},
  }),
});
const UserEducationType = new GraphQLObjectType({
  name: 'UserEducation',
  description: 'A user education.',
  fields: () => ({
    title: {type: GraphQLString},
  }),
});
const UserExperienceType = new GraphQLObjectType({
  name: 'UserExperience',
  description: 'A user experience',
  fields: () => ({
    title: {type: GraphQLString},
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app.',
  fields: () => ({
    id: globalIdField('User'),
    ...commonFields,
    logged: {
      type: GraphQLBoolean,
      description: 'If the user is logged id.',
    },
    hasEmailProvider: {
      type: GraphQLBoolean,
      description: 'If the user registered using email.',
      resolve: (user) => !user.get('authData'),
    },
    name: {
      type: GraphQLString,
      description: 'The user full name.',
      resolve: (user) => user.get('name'),
    },
    firstName: {
      type: GraphQLString,
      description: 'The user first name.',
      resolve: (user) => user.get('firstName'),
    },
    lastName: {
      type: GraphQLString,
      description: 'The user last name.',
      resolve: (user) => user.get('lastName'),
    },
    pictureURL: {
      type: GraphQLString,
      description: 'The user profile picture url.',
      resolve: (user) => getUserPicture(user),
    },
    rating: {
      type: GraphQLFloat,
      description: 'The user rating from 0 to 5.',
      resolve: (user) => user.get('rating'),
    },
    tasksCompleted: {
      type: GraphQLInt,
      description: 'The amount of tasks completed by the user.',
      resolve: (user) => user.get('tasksCompleted'),
    },
    about: {
      type: GraphQLString,
      description: 'The user about info.',
      resolve: (user) => user.get('about'),
    },
    skills: {
      type: new GraphQLList(UserSkillType),
      description: 'The user skills.',
      resolve: (user) => user.get('skills'),
    },
    experience: {
      type: new GraphQLList(UserExperienceType),
      description: 'The user experience.',
      resolve: (user) => user.get('experience'),
    },
    education: {
      type: new GraphQLList(UserEducationType),
      description: 'The user education.',
      resolve: (user) => user.get('education'),
    },
    feedback: {
      type: FeedbackConnectionType,
      args: connectionArgs,
      description: 'The feedback for the user',
      resolve: async (data, args, {rootValue}) => {
        const feedback = await getUserFeedback(rootValue, data.id);
        return connectionFromArray(feedback, args);
      },
    },
    tasks: {
      type: TaskConnectionType,
      args: connectionArgs,
      description: 'The tasks created by the user.',
      resolve: async (user, args, {rootValue}) => {
        const tasks = await getTasksForUser(rootValue, user.id);
        return connectionFromArray(tasks, args);
      },
    },
    applications: {
      type: ApplicationConnectionType,
      args: connectionArgs,
      description: 'The applications created by the user',
      resolve: async (user, args, {rootValue}) => {
        const applications = await getApplicationsForUser(rootValue, user.id);
        return connectionFromArray(applications, args);
      },
    },
    privateData: {
      type: UserPrivateType,
      description: `The user private information. Must be the user making the
                    request to acces it.`,
      resolve: (user) => user.get('privateData'),
    },
  }),
  interfaces: [nodeInterface],
});

addResolver(
  async (type, id, {rootValue}) => {
    if (type === 'User') {
      return getUser(rootValue, id);
    } else if (type === 'UserPrivate') {
      return getUserPrivate(rootValue, id);
    }
    return null;
  },
  (obj) => {
    if (!obj.className) {
      return null;
    }
    if (obj.className === '_User') {
      return UserType;
    } else if (obj.className === 'UserPrivateData') {
      return UserPrivateType;
    }
    return null;
  },
);
