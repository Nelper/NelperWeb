import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  changeUserLanguage,
  updateNotificationSettings,
} from '../data/userData';

import {
  UserPrivateType,
  NotificationSettingInputType,
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
