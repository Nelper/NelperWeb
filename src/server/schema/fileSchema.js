import {
  GraphQLObjectType,
  GraphQLString,
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
