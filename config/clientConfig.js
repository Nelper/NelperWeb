/* eslint no-console: 0 */

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const CONFIG_FILE_PATH = path.resolve(__dirname, './client.config.yaml');

let config;
try {
  config = yaml.load(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'));
} catch (err) {
  console.error('Unable to load client config.', err);
  process.exit(1);
}

module.exports = config;
