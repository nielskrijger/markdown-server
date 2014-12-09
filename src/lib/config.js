'use strict';

var nconf = require('nconf');
var defaultConfig = require('../config/default.json');

// Setup configuration (in-order):
// 1. Command-line arguments
// 2. Environment variables
// 3. A file located at 'config/{NODE_ENV}.json'
// 4. Defaults
nconf.argv().env({
    separator: '_'
}).file('../config/' + process.env.NODE_ENV + '.json').defaults(defaultConfig);

module.exports = nconf;
