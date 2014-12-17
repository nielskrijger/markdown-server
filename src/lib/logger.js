'use strict';

var bunyan = require('bunyan');
var bunyanLogentries = require('bunyan-logentries')
var os = require('os');
var _ = require('underscore');
var config = require('./config');

var streams = [];

// Configure log stream to stdout.
if (config.get('log.stdout.level') != 'none') {
    streams.push({
        stream: process.stdout,
        level: config.get('log.stdout.level')
    });
}

// Configure log stream to logentries.
if (config.get('log.logentries.level') != 'none') {
    if (_.isEmpty(config.get('log.logentries.token'))) {
        throw new Error('No logentries token configured (set in configuration file or as LOGENTRIES_TOKEN env variable)');
    }
    streams.push({
        level: config.get('log.logentries.level'),
        stream: bunyanLogentries.createStream({
            token: config.get('log.logentries.token')
        }),
        type: 'raw'
    });
}

// Instantiates the Bunyan logger.
var logger = bunyan.createLogger({
    name: config.get('log.name'),
    hostname: (config.get('log.hostname')) ? config.get('log.hostname') : os.hostname(),
    streams: streams
});

module.exports = logger;
