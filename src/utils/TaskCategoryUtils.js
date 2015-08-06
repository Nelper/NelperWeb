import Color from 'color';

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
      colorLight: Color(colors.yellow).lighten(0.4).hexString(),
      colorDark: Color(colors.yellow).darken(0.5).hexString(),
      name: 'Electronic & IT Support',
    },
    'housecleaning': {
      color: colors.purple,
      colorLight: Color(colors.purple).lighten(0.3).hexString(),
      colorDark: Color(colors.purple).darken(0.5).hexString(),
      name: 'Cleaning',
    },
    'handywork': {
      color: colors.orange,
      colorLight: Color(colors.orange).lighten(0.3).hexString(),
      colorDark: Color(colors.orange).darken(0.5).hexString(),
      name: 'Handywork',
    },
    'gardening': {
      color: colors.green,
      colorLight: Color(colors.green).lighten(0.4).hexString(),
      colorDark: Color(colors.green).darken(0.5).hexString(),
      name: 'Gardening',
    },
    'business': {
      color: colors.blue,
      colorLight: Color(colors.blue).lighten(0.2).hexString(),
      colorDark: Color(colors.blue).darken(0.5).hexString(),
      name: 'Business & Admin',
    },
    'multimedia': {
      color: colors.red,
      colorLight: Color(colors.red).lighten(0.2).hexString(),
      colorDark: Color(colors.red).darken(0.5).hexString(),
      name: 'Multimedia & Design',
    },
  }

  static list() {
    return Object.keys(this._categories);
  }

  static getImage(category) {
    if(!this._categories[category]) {
      return null;
    }
    return require(`images/categories/${category}.png`);
  }

  static getColor(category) {
    return this._categories[category].color;
  }

  static getDarkColor(category) {
    return this._categories[category].colorDark;
  }

  static getLightColor(category) {
    return this._categories[category].colorLight;
  }

  static getName(category) {
    return this._categories[category].name;
  }

  static setRandomCategory(task) {
    if(!task.category) {
      let categories = Object.keys(this._categories);
      task.category = categories[Math.floor(Math.random() * 1000) % categories.length];
    }
  }
}
