export default class IntlUtils {

  static _messages = null

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

      require('expose?ReactIntl!react-intl');

      switch (locale.toUpperCase()) {
      case 'FR-CA':
        if (polyfillIntl) {
          require.ensure([
            'intl',
            'react-intl/dist/locale-data/fr',
            'messages/fr',
          ], (require) => {
            require('intl');
            require('react-intl/dist/locale-data/fr');
            IntlUtils._messages = flattenMessagesKeys(require('messages/fr'));
            resolve(IntlUtils._messages);
          });
        } else {
          require.ensure([
            'react-intl/dist/locale-data/fr',
            'messages/fr',
          ], (require) => {
            require('react-intl/dist/locale-data/fr');
            IntlUtils._messages = flattenMessagesKeys(require('messages/fr'));
            resolve(IntlUtils._messages);
          });
        }
        break;
      default:
        if (polyfillIntl) {
          require.ensure(['intl', 'messages/en'], (require) => {
            require('intl');
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

  static getMessage(id) {
    return IntlUtils._messages[id];
  }
}