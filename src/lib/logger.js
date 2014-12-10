'use strict';

var bunyan = require('bunyan');
var os = require('os');
var config = require('./config');

var streams = [];

// Configure log stream to stdout.
if (config.get('log.stdout.enable')) {
    streams.push({
        stream: process.stdout,
        level: config.get('log.stdout.level')
    });
}

// Instantiates the Bunyan logger.
var logger = bunyan.createLogger({
    name: config.get('log.name'),
    hostname: (config.get('log.hostname')) ? config.get('log.hostname') : os.hostname(),
    streams: streams
});

module.exports = logger;
