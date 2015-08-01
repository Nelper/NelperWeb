import Color from 'color';

const colors = {
  yellow: '#f7cc39',
  purple: '#997dd9',
  blue: '#4498d3',
  green: '#29b473',
  pink: '#f0595a',
};

export default class TaskCategoryUtils {

  static _categories = {
    'technology': {
      color: colors.yellow,
      colorLight: Color(colors.yellow).lighten(0.5),
      colorDark: Color(colors.yellow).darken(0.5),
      name: 'Technology',
    },
    'housecleaning': {
      color: colors.purple,
      colorLight: Color(colors.purple).lighten(0.5),
      colorDark: Color(colors.purple).darken(0.5),
      name: 'Cleaning',
    },
    'handywork': {
      color: colors.blue,
      colorLight: Color(colors.blue).lighten(0.5),
      colorDark: Color(colors.blue).darken(0.5),
      name: 'Handywork',
    },
    'gardening': {
      color: colors.green,
      colorLight: Color(colors.green).lighten(0.5),
      colorDark: Color(colors.green).darken(0.5),
      name: 'Gardening',
    },
    'cooking': {
      color: colors.pink,
      colorLight: Color(colors.pink).lighten(0.5),
      colorDark: Color(colors.pink).darken(0.5),
      name: 'Cooking',
    },
  }

  static list() {
    return Object.keys(this._categories);
  }

  static getImage(category) {
    return require(`images/icons/category-${category}.png`);
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
