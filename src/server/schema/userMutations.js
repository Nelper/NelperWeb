import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  changeUserLanguage,
  updateNotificationSettings,
  editUserLocations,
} from '../data/userData';

import {
  UserPrivateType,
  NotificationSettingInputType,
  LocationInputType,
} from './types';

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

export const EditLocationsMutation = mutationWithClientMutationId({
  name: 'EditLocations',
  inputFields: {
    locations: {type: new GraphQLList(LocationInputType)},
  },
  outputFields: {
    privateData: {
      type: UserPrivateType,
      resolve: ({privateData}) => {
        return privateData;
      },
    },
  },
  mutateAndGetPayload: async ({locations}, {rootValue}) => {
    const privateData = await editUserLocations(rootValue, locations);
    return {privateData};
  },
});
