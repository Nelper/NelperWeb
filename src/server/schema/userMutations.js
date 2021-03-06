import {
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  saveGeneralSettings,
  updateNotificationSettings,
  editUserLocations,
  editUserProfile,
  changePassword,
  createAccount,
} from '../data/userData';

import {
  UserType,
  UserPrivateType,
  NotificationSettingInputType,
  LocationInputType,
  FileInputType,
} from './types';

export const CreateAccountMutation = mutationWithClientMutationId({
  name: 'CreateAccount',
  inputFields: {
    type: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    firstName: {type: new GraphQLNonNull(GraphQLString)},
    lastName: {type: new GraphQLNonNull(GraphQLString)},
    pictureURL: {type: GraphQLString},
  },
  outputFields: {
    me: {
      type: UserType,
      resolve: ({user}) => {
        return user;
      },
    },
  },
  mutateAndGetPayload: async ({type, email, firstName, lastName, pictureURL}, {rootValue}) => {
    const user = await createAccount(rootValue, type, email, firstName, lastName, pictureURL);
    return {user};
  },
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

export const SaveGeneralSettingsMutation = mutationWithClientMutationId({
  name: 'SaveGeneralSettings',
  inputFields: {
    email: {type: GraphQLString},
    phone: {type: GraphQLString},
    language: {type: GraphQLString},
  },
  outputFields: {
    privateData: {
      type: UserPrivateType,
      resolve: ({privateData}) => {
        return privateData;
      },
    },
  },
  mutateAndGetPayload: async ({email, phone, language}, {rootValue}) => {
    const privateData = await saveGeneralSettings(rootValue, email, phone, language);
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

export const ChangePasswordMutation = mutationWithClientMutationId({
  name: 'ChangePassword',
  inputFields: {
    currentPassword: {type: new GraphQLNonNull(GraphQLString)},
    newPassword: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({error}) => error,
    },
  },
  mutateAndGetPayload: async ({currentPassword, newPassword}, {rootValue}) => {
    const error = await changePassword(rootValue, currentPassword, newPassword);
    return {error};
  },
});

const UserSkillInputType = new GraphQLInputObjectType({
  name: 'UserSkillInput',
  description: 'A user skill input.',
  fields: () => ({
    title: {type: GraphQLString},
  }),
});
const UserEducationInputType = new GraphQLInputObjectType({
  name: 'UserEducationInput',
  description: 'A user education input.',
  fields: () => ({
    title: {type: GraphQLString},
  }),
});
const UserExperienceInputType = new GraphQLInputObjectType({
  name: 'UserExperienceInput',
  description: 'A user experience input.',
  fields: () => ({
    title: {type: GraphQLString},
  }),
});

export const EditProfileMutation = mutationWithClientMutationId({
  name: 'EditProfile',
  inputFields: {
    picture: {type: FileInputType},
    about: {type: GraphQLString},
    skills: {type: new GraphQLList(UserSkillInputType)},
    education: {type: new GraphQLList(UserEducationInputType)},
    experience: {type: new GraphQLList(UserExperienceInputType)},
  },
  outputFields: {
    me: {
      type: UserType,
      resolve: (me) => {
        return me;
      },
    },
  },
  mutateAndGetPayload: async ({picture, about, skills, education, experience}, {rootValue}) => {
    return await editUserProfile(rootValue, picture, about, skills, education, experience);
  },
});
