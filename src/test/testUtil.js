'use strict';

var assert = require('chai').assert;
var _ = require('lodash');

module.exports.assertObject = function(actual, expected, parentProperties) {
    if (!parentProperties) {
        parentProperties = [];
    }
    for (var property in expected) {
        if (expected.hasOwnProperty(property)) {
            var propertyName = (parentProperties.length > 0) ? (parentProperties.join('.')) + '.' + property : property;
            if (expected[property] instanceof RegExp) {
                console.log('Regexp: ' + property);
                assert.ok(actual[property].match(expected[property]),
                    'Expected "' + propertyName + '" to match regex "' + expected[property].toString()+ '"');
            } else if (expected[property] instanceof Object) {
                console.log('Object: ' + property);
                parentProperties.push(property);
                assert.ok(actual[property], 'Property "' + propertyName + '" cannot be empty');
                assertObject(actual[property], expected[property], parentProperties);
            } else {
                console.log('Equal: ' + property);
                assert.equal(actual[property], expected[property], 'Property "' + propertyName + '" was invalid');
            }
        }
    }
};

module.exports.assertValidationError = function(body, dataPath, code, params) {
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
