'use strict';

process.env.NODE_ENV = 'test'; // set node environment to load correct configuration files

var request = require('request');
var assert = require('chai').assert;
var _ = require('lodash');
var config = require('../lib/config');
var mongodb = require('../lib/mongodb');
var log = require('../lib/logger');
var app = require('../app');

var path = 'http://127.0.0.1:' + config.get('port');

var testServer = null;

module.exports.startEnvironment = function(callback) {
    return app.then(function(server) {
        testServer = server;
        callback();
    });
};

module.exports.stopEnvironment = function(callback) {
    mongodb.connection()
        .closeAsync()
        .then(function() {
            testServer.close(callback);
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
