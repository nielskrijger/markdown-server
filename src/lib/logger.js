'use strict';

var winston = require('winston');
var Logentries = require('winston-logentries');
var os = require('os');
var _ = require('lodash');
var config = require('./config');

var transports = [];

// Configure log stream to stdout.
if (config.get('log.stdout.level') != 'none') {
    transports.push(
        new (winston.transports.Console)({
            level: config.get('log.stdout.level'),
            prettyPrint: true,
            colorize: true,
        })
    );
}

// Configure log stream to logentries.
if (config.get('log.logentries.level') != 'none') {
    if (_.isEmpty(config.get('log.logentries.token'))) {
        throw new Error('No logentries token configured (set in configuration file or as LOGENTRIES_TOKEN env variable)');
    }
    transports.push(
        new winston.transports.Logentries({
            level: config.get('log.logentries.level'),
            token: config.get('log.logentries.token')
        })
    );
}

// Instantiates the Bunyan logger.
var logger = new winston.Logger({
    transports: transports
});

logger.on('error', function(err) {
    console.log('Error occurred while processing a log message: ' + err);
});

module.exports = logger;
