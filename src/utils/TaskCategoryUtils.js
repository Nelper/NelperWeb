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
      colorLight: Color(colors.blue).lighten(0.2).hexString(),
      colorDark: Color(colors.blue).darken(0.5).hexString(),
      name: 'Business & Admin',
      examples: 'Accounting, Files Organization, Resume Building, Letters Writing & Review, Advertisement Strategies, Social Media Account Management, Data Entry, and more!',
    },
    'handywork': {
      color: colors.orange,
      colorLight: Color(colors.orange).lighten(0.3).hexString(),
      colorDark: Color(colors.orange).darken(0.5).hexString(),
      name: 'Handyman',
      examples: 'Furniture Assembly, Carpentry, Electrical Work, Painting, Plumbing, Roofing, Window Services, Appliance Repair, Floor Installation, and more!',
    },
    'gardening': {
      color: colors.green,
      colorLight: Color(colors.green).lighten(0.4).hexString(),
      colorDark: Color(colors.green).darken(0.5).hexString(),
      name: 'Gardening',
      examples: 'Garden Maintenance, Landscaping, Lawn Mowing, Raking Leaves, Outdoor Pest Control, Arborism, Fruit Tree Pruning, Tree Planting, Bushes Pruning, and more!',
    },
    'housecleaning': {
      color: colors.purple,
      colorLight: Color(colors.purple).lighten(0.3).hexString(),
      colorDark: Color(colors.purple).darken(0.5).hexString(),
      name: 'Cleaning',
      examples: 'House Cleaning, Laundry Services, Waste Removal, Guttering, Pool & Spa Cleaning, Steam Cleaning, Car Wash, and more!',
    },
    'technology': {
      color: colors.yellow,
      colorLight: Color(colors.yellow).lighten(0.4).hexString(),
      colorDark: Color(colors.yellow).darken(0.5).hexString(),
      name: 'Electronic & IT Support',
      examples: 'Computer Fixing, Hardware Setup, Internet Setup, Apple & iTunes Help, Cable Management, Printer/Scan Installation, TV & Sound System Installation, Email Setup, Tablets & Phones Support and more!',
    },
    'multimedia': {
      color: colors.red,
      colorLight: Color(colors.red).lighten(0.2).hexString(),
      colorDark: Color(colors.red).darken(0.5).hexString(),
      name: 'Multimedia & Design',
      examples: 'Website Development & Design, Mobile App Development, Photo & Video Editing, Graphic Design, Print & Design, Video Intro Creation, Music Production, and more!',
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

  static getExamples(category) {
    return this._categories[category].examples;
  }
}
