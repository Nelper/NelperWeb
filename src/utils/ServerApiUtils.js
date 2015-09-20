import Parse from 'parse/node';

import patchParse from './patchParse';
import {meFromParse} from './ParseUtils';

patchParse(Parse);

export default class ServerApiUtils {
  static becomeUser(userId, token) {
    return new Parse.Query(Parse.User)
      .include('privateData')
      .get(userId, {
        sessionToken: token,
      })
      .then((user) => meFromParse(user));
  }
}
