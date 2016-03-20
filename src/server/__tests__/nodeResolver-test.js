jest.dontMock('../nodeResolver');

import {
  graphql,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
} from 'graphql';

import {
  toGlobalId,
  globalIdField,
} from 'graphql-relay';

const {
  addResolver,
  nodeField,
  nodeInterface,
} = require('../nodeResolver');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
    },
  }),
  interfaces: [nodeInterface],
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: () => ({
        id: 1,
        name: 'Jane Mills',
      }),
    },
  }),
});

const Schema = new GraphQLSchema({
  query: QueryType,
});

describe('nodeResolver', () => {
  pit('adds a resolver', async () => {
    const userName = 'Jane Mills';
    const userId = '1';
    const user = {id: userId, name: userName};
    const idFetcher = jest.genMockFunction()
      .mockReturnValue(user);
    const typeResolver = jest.genMockFunction()
      .mockReturnValue(UserType);
    addResolver(
      idFetcher,
      typeResolver,
    );
    const userGlobalId = toGlobalId('User', userId);
    const query = `
      query MeQuery {
        node(id:"${userGlobalId}") {
          ... on User {
            id,
            name,
          }
        }
      }
    `;
    const result = await graphql(Schema, query);
    expect(idFetcher).toBeCalled();
    expect(typeResolver).toBeCalled();
    expect(result).toEqual({
      data: {
        node: {
          id: userGlobalId,
          name: userName,
        },
      },
    });
  });
});
