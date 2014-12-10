'use strict';

var assert = require('chai').assert;
var uuid = require('node-uuid');
var moment = require('moment');
var util = require('util');
var e2e = require('../../e2e');

describe('patterns/pattern.js:', function() {

    var pattern = null;

    before(function(done) {
        e2e.startEnvironment(done);
    });

    after(function(done) {
        e2e.stopEnvironment(done);
    });

    beforeEach(function() {
        pattern = {
            name: uuid.v4(),
            markdown: 'This *is* a **markdown** test'
        };
    });

    describe('post pattern', function() {
        it('should create a new pattern successfully', function(done) {
            var oldPatternName = pattern.name;
            pattern.name += '_+!@#%';
            e2e.postPattern(pattern, function(err, res, body) {
                console.log(err);
                assert.equal(res.statusCode, 201);
                assert.equal(res.headers['location'], '/api/patterns/' + body.slug);
                assert.deepEqual(body, {
                    name: pattern.name,
                    rev: 0,
                    markdown: 'This *is* a **markdown** test',
                    slug: oldPatternName + '_',
                    html: '<p>This <em>is</em> a <strong>markdown</strong> test</p>'
                });
                done();
            });
        });

        it('should fail when required properties are missing', function(done) {
            e2e.postPattern({}, function(err, res, body) {
                e2e.hasValidationError(body, '', 'OBJECT_REQUIRED', {
                    key: 'name'
                });
                e2e.hasValidationError(body, '', 'OBJECT_REQUIRED', {
                    key: 'markdown'
                });
                assert.equal(body.errors.length, 2);
                done();
            });
        });

        it('should fail when name is already in use', function(done) {
            e2e.postPattern(pattern, function(err, res, body) {
                e2e.postPattern(pattern, function(err, res, body) {
                    console.log(err);
                    console.log(body);
                    done();
                });
            });
        });
    });
});
