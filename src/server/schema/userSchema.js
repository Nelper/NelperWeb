import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
} from 'graphql';

import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  nodeInterface,
  addResolver,
} from '../nodeResolver';

import {
  getUser,
  getUserPicture,
  getUserPrivate,
  changeUserLanguage,
  updateNotificationSettings,
} from '../data/userData';

import {getTasksForUser} from '../data/taskData';
import {getApplicationsForUser} from '../data/applicationData';

import {
  TaskConnectionType,
  ApplicationConnectionType
} from './index';

const LocationType = new GraphQLObjectType({
  name: 'Location',
  description: 'A user saved location.',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The location name.',
    },
    formattedAddress: {
      type: GraphQLString,
      description: 'The full address formatted.',
    },
    streetNumber: {
      type: GraphQLString,
      description: 'The door number.',
    },
    route: {
      type: GraphQLString,
      description: 'The street name.',
    },
    city: {
      type: GraphQLString,
      description: 'The city.',
    },
    province: {
      type: GraphQLString,
      description: 'The province.',
    },
    country: {
      type: GraphQLString,
      description: 'The country.',
    },
    postalCode: {
      type: GraphQLString,
      description: 'The postal code.',
    },
  }),
});

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

const NotificationSettingInputType = new GraphQLInputObjectType({
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
  description: 'A person who uses our app.',
  fields: () => ({
    id: globalIdField('UserPrivate'),
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

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app.',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'The user full name.',
      resolve: (user) => user.get('name'),
    },
    pictureURL: {
      type: GraphQLString,
      description: 'The user profile picture url.',
      resolve: (user) => getUserPicture(user),
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

export const UpdateNotificationSettingsMutation = mutationWithClientMutationId({
  name: 'UpdateNotificationSettings',
  inputFields: {
    settingId: {type: GraphQLString},
    settingValue: {type: NotificationSettingInputType},
  },
  outputFields: {
    privateData: {
      type: UserPrivateType,
      resolve: ({privateData}) => {
        return privateData;
      },
    },
  },
  mutateAndGetPayload: async ({settingId, settingValue}, {rootValue}) => {
    const privateData = await updateNotificationSettings(rootValue, settingId, settingValue);
    return {privateData};
  },
});

export const ChangeLanguageMutation = mutationWithClientMutationId({
  name: 'ChangeLanguage',
  inputFields: {
    language: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    privateData: {
      type: UserPrivateType,
      resolve: ({privateData}) => {
        return privateData;
      },
    },
  },
  mutateAndGetPayload: async ({language}, {rootValue}) => {
    const privateData = await changeUserLanguage(rootValue, language);
    return {privateData};
  },
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
