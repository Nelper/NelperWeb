import Parse from 'parse';
import Relay from 'react-relay';

import {TaskApplication} from './ParseModels';

import {
  meFromParse,
  fixParseFileURL,
} from './ParseUtils';
import patchParse from './patchParse';

import CreateAccountMutation from 'actions/user/CreateAccountMutation';
import RelayNetworkLayer from '../app/RelayNetworkLayer';

patchParse(Parse);

/**
 * Utils for communicating with the backend (Parse).
 */
class ApiUtils {

  /**
   * Logs the user in using email and password.
   * @param  {Object} loginInfo          User login info
   * @param  {string} loginInfo.email    Email address
   * @param  {string} loginInfo.password Password
   * @return {Promise} The logged in user
   */
  login({email, password}) {
    return Parse.User.logIn(email, password)
      .then(() => {
        this._initSession();
      });
  }

  /**
   * Creates an account for the user.
   * @param  {Object} registerInfo          User registration info
   * @param  {string} registerInfo.email    Email address
   * @param  {string} registerInfo.password Password
   * @param  {string} registerInfo.name     Full name
   * @return {Promise} The registered user
   */
  register({email, password, firstName, lastName}) {
    const parseUser = new Parse.User();
    parseUser.set('username', email);
    parseUser.set('password', password);
    parseUser.set('name', name);
    return parseUser.signUp()
      .then(() => {
        this._initSession();
        return new Promise((resolve, reject) => {
          Relay.Store.update(
            new CreateAccountMutation({
              type: 'facebook',
              email: email,
              firstName: firstName,
              lastName: lastName,
            }), {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });
      });
  }

  /**
   * Logs the user in with Facebook. It will create an accoutn
   * if the user doesn't have one yet.
   *
   * @return {Promise} The logged in user
   */
  loginWithFacebook() {
    return new Promise((resolve, reject) => {
      Parse.FacebookUtils.logIn('email', {
        success: (user) => {
          this._getUserInfoFromFacebook().then((fbUser) => {
            this._initSession();
            if (user.isNew()) {
              Relay.Store.update(
                new CreateAccountMutation({
                  type: 'facebook',
                  email: fbUser.email,
                  firstName: fbUser.first_name,
                  lastName: fbUser.last_name,
                  pictureURL: fbUser.picture.data.url,
                }), {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            } else {
              resolve();
            }
          });
        },
      });
    });
  }

  /**
   * Log out the user.
   */
  logout() {
    Parse.User.logOut();
    if (__CLIENT__) {
      document.cookie = 'p_session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'p_user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  /**
   * Fetch the current user from the server.
   * @return {Promise} The user
   */
  updateUser() {
    return Parse.User.current().fetch()
      .then((user) => {
        return user.get('privateData').fetch();
      })
      .then(() => {
        this._initSession();
        return meFromParse(Parse.User.current());
      });
  }

  getUserSession() {
    const parseUser = Parse.User.current();
    if (!parseUser) {
      return null;
    }
    return parseUser.id + '-' + parseUser.getSessionToken();
  }

  updateUserSession(password) {
    const parseUser = Parse.User.current();
    return Parse.User.logOut()
      .then(() => Parse.User.logIn(parseUser.get('username'), password))
      .then(() => this._initSession());
  }

  /**
   * Sets the user geo location.
   * @param {GeoPoint} loc The user geo point
   */
  setUserLocation(loc) {
    /* const user = Parse.User.current();
    if (!user) return;
    const pt = new Parse.GeoPoint(loc.latitude, loc.longitude);
    const privateData = user.get('privateData');
    privateData.set('location', pt);
    privateData.save();*/
  }

  /**
   * Mark a task as viewed.
   * @param {Task} task The task to mask as viewed
   */
  setTaskViewed(task) {
    const parseApplications = task.applications
      .filter(a => a.isNew)
      .map(a => {
        const parseApplication = new TaskApplication();
        parseApplication.id = a.objectId;
        parseApplication.set('isNew', false);
        return parseApplication;
      });

    Parse.Object.saveAll(parseApplications);
  }

  /**
   * Upload a file to the file server.
   * @param  {string} name The name of the file
   * @param  {FormData} file The file as FormData
   * @return {Promise} Info about the uploaded file
   */
  uploadFile(name, file) {
    const parseFile = new Parse.File(name, file);
    return parseFile.save()
      .then((f) => {
        return this._fileFromParse(f);
      });
  }

  _initSession() {
    if (__CLIENT__) {
      const parseSessionToken = Parse.User.current().getSessionToken();
      const parseUserId = Parse.User.current().id;
      document.cookie = `p_session=${parseSessionToken}`;
      document.cookie = `p_user=${parseUserId}`;
      const session = this.getUserSession();
      Relay.injectNetworkLayer(
        new RelayNetworkLayer(session),
      );
    }
  }

  _fileFromParse(parseFile) {
    if (typeof parseFile.url === 'function') {
      return {
        url: fixParseFileURL(parseFile.url()),
        file: parseFile,
        name: parseFile.name(),
        objectId: parseFile.name(),
      };
    }
    return {
      url: fixParseFileURL(parseFile.url),
      file: parseFile,
      name: parseFile.name,
      objectId: parseFile.name,
    };
  }

  /**
   * Gets additional info about the user from Facebook
   * using the Facebook Graph API.
   * @private
   * @return {Promise} Info from Facebook
   */
  _getUserInfoFromFacebook() {
    return new Promise((resolve, reject) => {
      FB.api('me?fields=name,first_name,last_name,email,picture.type(large)', (response) => {
        if (response.error) {
          reject(response.error);
          return;
        }
        resolve(response);
      });
    });
  }
}

export default new ApiUtils();
