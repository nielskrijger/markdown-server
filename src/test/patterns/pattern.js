'use strict';

var assert = require('chai').assert;
var uuid = require('node-uuid');
var moment = require('moment');
var util = require('util');
var testUtil = require('../testUtil');
var e2e = require('../e2e');

describe('patterns/pattern.js:', function() {

    var pattern = null;
    var expected = null;

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
        expected = {
            id: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
            rev: 0,
            name: pattern.name,
            slug: pattern.name,
            markdown: 'This *is* a **markdown** test',
            html: '<p>This <em>is</em> a <strong>markdown</strong> test</p>'
        };
    });

    describe('POST pattern', function() {
        it('should successfully create a new pattern', function(done) {
            var oldPatternName = pattern.name;
            pattern.name += '_+!@#%';
            expected.name = pattern.name;
            expected.slug += '_';
            e2e.postPattern(pattern, function(err, res, body) {
                assert.equal(res.statusCode, 201);
                assert.equal(res.headers['location'], '/api/patterns/' + body.id);
                testUtil.assertObject(body, expected);
                done();
            });
        });

        it('should fail when required properties are missing', function(done) {
            e2e.postPattern({}, function(err, res, body) {
                testUtil.assertValidationError(body, '', 'OBJECT_REQUIRED', { key: 'name' });
                testUtil.assertValidationError(body, '', 'OBJECT_REQUIRED', { key: 'markdown' });
                assert.equal(body.errors.length, 2);
                done();
            });
        });

        it.skip('should fail when name is already in use', function(done) {
            e2e.postPattern(pattern, function(err, res, body) {
                e2e.postPattern(pattern, function(err, res, body) {
                    console.log(err);
                    console.log(body);
                    done();
                });
            });
        });
    });

    describe('GET pattern', function(done) {
        it('should successfully retrieve an existing pattern', function(done) {
            e2e.postPattern(pattern, function(err, res, body) {
                e2e.getPattern(body.slug, function(err, res, body) {
                    testUtil.assertObject(body, expected);
                    done();
                });
            });
        });
    });
});
