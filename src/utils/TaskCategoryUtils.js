import IntlUtils from './IntlUtils';

const colors = {
  yellow: '#f7cc39',
  purple: '#997dd9',
  blue: '#4498d3',
  green: '#29b473',
  orange: '#f9a34b',
  red: '#f0595a',
};

export default class TaskCategoryUtils {

  static _categories = {
    'technology': {
      color: colors.yellow,
    },
    'business': {
      color: colors.blue,
    },
    'multimedia': {
      color: colors.red,
    },
    'gardening': {
      color: colors.green,
    },
    'handywork': {
      color: colors.orange,
    },
    'housecleaning': {
      color: colors.purple,
    },
    'other': {
      color: colors.red,
    },
  }

  static list() {
    return Object.keys(this._categories);
  }

  static getImage(category) {
    if (!this._categories[category]) {
      return null;
    }
    try {
      return require(`images/categories/${category}_${IntlUtils.getLanguage()}.png`);
    } catch (e) {
      return require(`images/categories/${category}.png`);
    }
  }

  static getPinImage(category) {
    if (!this._categories[category]) {
      return null;
    }
    try {
      return require(`images/categories/${category}-pin_${IntlUtils.getLanguage()}.png`);
    } catch (e) {
      return require(`images/categories/${category}-pin.png`);
    }
  }
}
