import React from 'react';
import {addLocaleData} from 'react-intl';

/**
 * Internationalization utils.
 */
export default class IntlUtils {

  static _messages = null
  static _language = null

  /**
   * Loads the data for the specified locale. Includes a polyfill for window.Intl
   * if the browser does not support it. Also loads all translated messages.
   * Supports en-CA and fr-CA.
   * @param  {string} locale The locale to load
   * @return {Promise}       Promise with the loaded messages
   */
  static init(locale) {
    /**
     * Flatten de messages object
     * TODO: compile this.
     */
    function flattenMessagesKeys(messages) {
      const result = {};

      for (const i in messages) {
        if (!messages.hasOwnProperty(i)) continue;

        if ((typeof messages[i]) === 'object') {
          const flatObject = flattenMessagesKeys(messages[i]);
          for (const x in flatObject) {
            if (!flatObject.hasOwnProperty(x)) continue;
            result[i + '.' + x] = flatObject[x];
          }
        } else {
          result[i] = messages[i];
        }
      }
      return result;
    }

    return new Promise((resolve) => {
      const polyfillIntl = __CLIENT__ && !window.Intl;
      const lang = locale.split('-')[0].toUpperCase();
      IntlUtils._language = lang;
      switch (lang) {
      case 'FR':
        if (polyfillIntl) {
          require.ensure([
            'intl',
            'intl/locale-data/jsonp/fr-CA',
            'react-intl/locale-data/fr',
            'messages/fr',
          ], (require) => {
            require('intl');
            require('intl/locale-data/jsonp/fr-CA');
            addLocaleData(require('react-intl/locale-data/fr'));
            IntlUtils._messages = flattenMessagesKeys(require('messages/fr'));
            resolve(IntlUtils._messages);
          });
        } else {
          require.ensure([
            'react-intl/locale-data/fr',
            'messages/fr',
          ], (require) => {
            addLocaleData(require('react-intl/locale-data/fr'));
            IntlUtils._messages = flattenMessagesKeys(require('messages/fr'));
            resolve(IntlUtils._messages);
          });
        }
        break;
      default:
        if (polyfillIntl) {
          require.ensure([
            'intl',
            'intl/locale-data/jsonp/en-CA',
            'messages/en',
          ], (require) => {
            require('intl');
            require('intl/locale-data/jsonp/en-CA');
            IntlUtils._messages = flattenMessagesKeys(require('messages/en'));
            resolve(IntlUtils._messages);
          });
        } else {
          require.ensure(['messages/en'], (require) => {
            IntlUtils._messages = flattenMessagesKeys(require('messages/en'));
            resolve(IntlUtils._messages);
          });
        }
        break;
      }
    });
  }

  /**
   * Get a translated message by id.
   * @param  {string} id Id of the message
   * @return {string}    The message
   */
  static getMessage(id) {
    return IntlUtils._messages[id];
  }

  static getLanguage() {
    return IntlUtils._language;
  }

  /**
   * Force the first letter of the message to be lowercase.
   * @param  {string} formattedMessage The message
   * @return {ReactElement}            A React span with the text modified
   */
  static lower(formattedMessage) {
    return <span>{formattedMessage.charAt(0).toLowerCase() + formattedMessage.slice(1)}</span>;
  }

  /**
   * Force the first letter of the message to be uppercase.
   * @param  {string} formattedMessage The message
   * @return {ReactElement}            A React span with the text modified
   */
  static upper(formattedMessage) {
    return <span>{formattedMessage.charAt(0).toUpperCase() + formattedMessage.slice(1)}</span>;
  }

  static formatPhoneNumber(number) {
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
  }

  static cleanPhoneNumber(number) {
    return number.replace(/[^0-9]/g, '');
  }
}
