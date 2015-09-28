import graphqlHTTP from 'express-graphql';

import {Schema} from './schema';

export default function(app) {
  app.use('/graphql', graphqlHTTP(request => {
    const auth = request.get('Authorization');
    let userId;
    let sessionToken;
    if (auth) {
      [userId, sessionToken] = auth.split('-');
    }
    return {
      schema: Schema,
      rootValue: {
        userId,
        sessionToken,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
      },
    };
  }));
}
