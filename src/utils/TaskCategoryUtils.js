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
    'business': {
      color: colors.blue,
      colorLight: new Color(colors.blue).lighten(0.2).hexString(),
      colorDark: new Color(colors.blue).darken(0.5).hexString(),
      name: 'Business & Admin',
      examples: 'Accounting, Files Organization, Resume Building, Letters Writing & Review, Advertisement Strategies, Social Media Account Management, Data Entry,',
    },
    'handywork': {
      color: colors.orange,
      colorLight: new Color(colors.orange).lighten(0.3).hexString(),
      colorDark: new Color(colors.orange).darken(0.5).hexString(),
      name: 'Handyman',
      examples: 'Furniture Assembly, Carpentry, Electrical Work, Painting, Plumbing, Roofing, Window Services, Appliance Repair, Floor Installation,',
    },
    'gardening': {
      color: colors.green,
      colorLight: new Color(colors.green).lighten(0.4).hexString(),
      colorDark: new Color(colors.green).darken(0.5).hexString(),
      name: 'Gardening',
      examples: 'Garden Maintenance, Landscaping, Lawn Mowing, Raking Leaves, Outdoor Pest Control, Arborism, Fruit Tree Pruning, Tree Planting, Bushes Pruning,',
    },
    'housecleaning': {
      color: colors.purple,
      colorLight: new Color(colors.purple).lighten(0.3).hexString(),
      colorDark: new Color(colors.purple).darken(0.5).hexString(),
      name: 'Cleaning',
      examples: 'House Cleaning, Laundry Services, Waste Removal, Guttering, Pool & Spa Cleaning, Steam Cleaning, Indoor Pest Control, Car Wash,',
    },
    'technology': {
      color: colors.yellow,
      colorLight: new Color(colors.yellow).lighten(0.4).hexString(),
      colorDark: new Color(colors.yellow).darken(0.5).hexString(),
      name: 'Electronic & IT Support',
      examples: 'Computer Fixing, Internet Setup, Printer & Scanner Installation, TV & Sound System Installation, Email Setup, Tablets & Phones Support,',
    },
    'multimedia': {
      color: colors.red,
      colorLight: new Color(colors.red).lighten(0.2).hexString(),
      colorDark: new Color(colors.red).darken(0.5).hexString(),
      name: 'Multimedia & Design',
      examples: 'Website & App Development, Photo & Video Editing, Graphic Design, Printing, Videography & Photography, Music Production,',
    },
    'other': {
      color: colors.red,
      colorLight: new Color(colors.red).lighten(0.2).hexString(),
      colorDark: new Color(colors.red).darken(0.5).hexString(),
      name: 'Other',
    },
  }

  static list() {
    return Object.keys(this._categories);
  }

  static getImage(category) {
    if (!this._categories[category]) {
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

  static getExamples(category) {
    return this._categories[category].examples;
  }
}
