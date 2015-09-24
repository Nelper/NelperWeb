import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

import {fixParseFileURL} from '../../utils/ParseUtils';

export const FileType = new GraphQLObjectType({
  name: 'File',
  description: 'A file on parse',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The name of the file',
      resolve: (file) => file.name(),
    },
    url: {
      type: GraphQLString,
      description: 'The url of the file',
      resolve: (file) => fixParseFileURL(file.url()),
    },
  }),
});

export const FileInputType = new GraphQLInputObjectType({
  name: 'FileInput',
  description: 'A file on parse input',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The name of the file',
    },
    url: {
      type: GraphQLString,
      description: 'The url of the file',
    },
  }),
});
