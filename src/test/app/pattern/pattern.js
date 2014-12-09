'use strict';

var assert = require('chai').assert;
var uuid = require('node-uuid');
var moment = require('moment');
var util = require('util');
var e2e = require('../../e2e');

var pattern = {
    name: 'Test'
};

describe('patterns/pattern.js:', function() {

    before(function(done) {
        e2e.startEnvironment(done);
    });

    after(function(done) {
        e2e.stopEnvironment(done);
    });

    it('should create a new pattern', function(done) {
        e2e.postPattern(pattern, function(err, res, body) {
            assert.notOk(err);
            done();
        });
    });
});
