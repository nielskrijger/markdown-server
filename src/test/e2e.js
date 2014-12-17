'use strict';

process.env.NODE_ENV = 'test'; // set node environment to load correct configuration files

var request = require('request');
var assert = require('chai').assert;
var _ = require('underscore');
var config = require('../lib/config');
var mongodb = require('../lib/mongodb');
var log = require('../lib/logger');
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
    mongodb.connection()
        .closeAsync()
        .then(function() {
            runningServer.close(function() {
                callback();
            });
        });
};

module.exports.postPattern = function(pattern, callback) {
    request.post({
        uri: path + '/api/patterns',
        json: pattern
    }, callback);
};

module.exports.getPattern = function(slug, callback) {
    request.get({
        uri: path + '/api/patterns/' + slug,
        json: true
    }, callback);
};

// TODO add validation method to body
module.exports.hasValidationError = function(body, dataPath, code, params) {
    assert.equal(body.status, 400);
    assert.equal(body.code, 'ValidationError');
    assert.equal(body.message, 'One or more request parameters are invalid');
    assert.ok(body.errors);
    var found = false;
    var i = 0;
    while (!found && i < body.errors.length) {
        var error = body.errors[i];
        found = (error.dataPath === dataPath && error.code === code && _.isEqual(error.params, params));
        i++;
    }
    if (!found) {
        assert.fail(body.errors, {}, 'No ' + code + ' error with dataPath "' + dataPath + '" found');
    }
};
