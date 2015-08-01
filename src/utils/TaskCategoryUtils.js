export default class TaskCategoryUtils {

  static _categories = {
    'technology': {
      color: '#f7cc39',
      name: 'Technology',
    },
    'housecleaning': {
      color: '#997dd9',
      name: 'Housecleaning',
    },
    'handywork': {
      color: '#4498d3',
      name: 'Handywork',
    },
    'gardening': {
      color: '#29b473',
      name: 'Gardening',
    },
    'cooking': {
      color: '#f0595a',
      name: 'Cooking',
    },
  }

  static getId(task) {
    this._setRandomCategory(task);
    return task.category;
  }

  static getImage(task) {
    this._setRandomCategory(task);

    return require(`images/icons/category-${task.category}.png`);
  }

  static getColor(task) {
    this._setRandomCategory(task);
    return this._categories[task.category].color;
  }

  static getName(task) {
    this._setRandomCategory(task);
    return this._categories[task.category].name;
  }

  static _setRandomCategory(task) {
    if(!task.category) {
      let categories = Object.keys(this._categories);
      task.category = categories[Math.floor(Math.random() * 1000) % categories.length];
    }
  }
}
