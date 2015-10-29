/* @flow */

import graphqlHTTP from 'express-graphql';

import {Schema} from './schema';

export type RootValue = {
  userId: ?string,
  sessionToken: ?string,
  userAgent: string,
  ip: string,
}

export default function(app: any) {
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
      pretty: process.env.NODE_ENV !== 'production',
    };
  }));
}
