const getBabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../src/server/schema.json');

const plugin = getBabelRelayPlugin(schema.data);

module.exports = plugin;
