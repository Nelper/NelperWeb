import Parse from 'parse';
import Relay from 'react-relay';

import {NelpTaskApplication, UserPrivateData} from './ParseModels';

import {
  meFromParse,
  fixParseFileURL,
} from './ParseUtils';
import patchParse from './patchParse';

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
      .then((user) => {
        return user.get('privateData').fetch();
      })
      .then(() => {
        this._initSession();
        return meFromParse(Parse.User.current());
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
  register({email, password, name}) {
    const parseUser = new Parse.User();
    parseUser.set('username', email);
    parseUser.set('password', password);
    parseUser.set('name', name);
    return parseUser.signUp()
      .then((user) => {
        return this._createUserBase(user, {email});
      })
      .then(() => {
        this._initSession();
        return meFromParse(Parse.User.current());
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
          resolve(user);
        },
        error: (error) => {
          reject(error);
        },
      });
    }).then((user) => {
      return this._getUserInfoFromFacebook()
        .then((fbUser) => {
          user.set('name', fbUser.name);
          user.set('firstName', fbUser.first_name);
          user.set('lastName', fbUser.last_name);
          user.set('pictureURL', fbUser.picture.data.url);
          if (!user.has('privateData')) {
            return this._createUserBase(user, {email: fbUser.email});
          }
          return user.get('privateData').fetch();
        })
        .then(() => {
          this._initSession();
          return meFromParse(Parse.User.current());
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

  /**
   * Sets the user geo location.
   * @param {GeoPoint} loc The user geo point
   */
  setUserLocation(loc) {
    const user = Parse.User.current();
    if (!user) return;
    const pt = new Parse.GeoPoint(loc.latitude, loc.longitude);
    const privateData = user.get('privateData');
    privateData.set('location', pt);
    privateData.save();
  }

  /**
   * Set the user profile picture.
   * @param {File} file The picture's file
   */
  setUserPicture(file) {
    const user = Parse.User.current();
    user.set('customPicture', file.file);
    return user.save().then(u => {
      return this._fileFromParse(u.get('customPicture'));
    });
  }

  /**
   * Edit the user's profile about section
   * @param {string} about About text
   */
  editUserAbout(about) {
    const user = Parse.User.current();
    user.set('about', about);
    return user.save();
  }

  /**
   * Adds a skill to the user's profile.
   * @param {Skill} skill The skill to add
   */
  addUserSkill(skill) {
    const user = Parse.User.current();
    user.add('skills', skill);
    user.save();
  }

  /**
   * Edit a skill in the user's profile.
   * @param {Skill} skill The skill to edit
   */
  editUserSkill(skill) {
    const user = Parse.User.current();
    const userSkills = user.get('skills');
    const index = userSkills.findIndex(s => s.objectId === skill.objectId);
    userSkills[index] = skill;
    user.save();
  }

  /**
   * Delete a skill in the user's profile.
   * @param {Skill} skill The skill to delete
   */
  deleteUserSkill(skill) {
    const user = Parse.User.current();
    user.remove('skills', skill);
    user.save();
  }

  /**
   * Add an experience item to the user's profile.
   * @param {Experience} exp The experience
   */
  addUserExperience(exp) {
    const user = Parse.User.current();
    user.add('experience', exp);
    user.save();
  }

  /**
   * Edit an experience item on the user's profile.
   * @param {Experience} exp The experience
   */
  editUserExperience(exp) {
    const user = Parse.User.current();
    const userExp = user.get('experience');
    const index = userExp.findIndex(e => e.objectId === exp.objectId);
    userExp[index] = exp;
    user.save();
  }

  /**
   * Delete an experience item from the user's profile.
   * @param {Experience} exp The experience
   */
  deleteUserExperience(exp) {
    const user = Parse.User.current();
    user.remove('experience', exp);
    user.save();
  }

  /**
   * Add an education item to the user's profile.
   * @param {Education} ed The education
   */
  addUserEducation(ed) {
    const user = Parse.User.current();
    user.add('education', ed);
    user.save();
  }

  /**
   * Edit an education item on the user's profile.
   * @param {Education} ed The education
   */
  editUserEducation(ed) {
    const user = Parse.User.current();
    const userExp = user.get('education');
    const index = userExp.findIndex(e => e.objectId === ed.objectId);
    userExp[index] = ed;
    user.save();
  }

  /**
   * Delete an education item from the user's profile.
   * @param {Education} ed The education
   */
  deleteUserEducation(ed) {
    const user = Parse.User.current();
    user.remove('education', ed);
    user.save();
  }

  /**
   * Mark a task as viewed.
   * @param {Task} task The task to mask as viewed
   */
  setTaskViewed(task) {
    const parseApplications = task.applications
      .filter(a => a.isNew)
      .map(a => {
        const parseApplication = new NelpTaskApplication();
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
      const headers = {};
      const session = this.getUserSession();
      if (session) {
        headers.Authorization = session;
      }
      Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer('/graphql', {
          headers,
        })
      );
    }
  }

  _createUserBase(user, {email}) {
    user.set('about', '');
    user.set('skills', []);
    user.set('education', []);
    user.set('experience', []);
    const userPrivate = new UserPrivateData();
    userPrivate.set('email', email);
    userPrivate.set('locations', []);
    userPrivate.set('notifications', {
      posterApplication: {
        email: true,
      },
      posterRequestPayment: {
        email: true,
      },
      nelperApplicationStatus: {
        email: true,
      },
      nelperReceivedPayment: {
        email: true,
      },
      newsletter: {
        email: true,
      },
    });
    userPrivate.setACL(new Parse.ACL(user));
    return userPrivate.save()
      .then(p => {
        user.set('privateData', p);
        return user.save();
      });
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
