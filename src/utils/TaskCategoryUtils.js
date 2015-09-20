import LogUtils from './LogUtils';

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
      LogUtils.warn('Invalid category id ' + category);
      return null;
    }
    return require(`images/categories/${category}.png`);
  }
}
