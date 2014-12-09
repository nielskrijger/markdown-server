'use strict';

process.env.NODE_ENV = 'test'; // Set this to select the correct configuration files

var request = require('request');
var config = require('../lib/config');
var mongodb = require('../lib/mongodb');
var server = require('../app');

var path = 'http://127.0.0.1:' + config.get('port');

var runningServer = null;

module.exports.startEnvironment = function(callback) {
    return server.then(function(server) {
        runningServer = server;
        callback();
    });
};

/**
 * Always close the entire e2e environment to ensure mocha quits after all tests are finished.
 */
module.exports.stopEnvironment = function(callback) {
    mongodb.connection().close(function(err) {
        runningServer.close();
        callback();
    });
};

module.exports.postPattern = function(pattern, callback) {
    request.post({
        uri: path + '/patterns',
        json: pattern
    }, callback);
};
