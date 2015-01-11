'use strict';

process.env.NODE_ENV = 'test'; // set node environment to load correct configuration files

var request = require('request');
var assert = require('chai').assert;
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

module.exports.getPatterns = function(callback) {
    request.get({
        uri: path + '/api/patterns',
        json: true
    }, callback);
};
