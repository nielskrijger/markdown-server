'use strict';

var util = require('util');
var tv4 = require('tv4');
var Promise = require('bluebird');
var config = require('./config');
var ValidationError = require('./RestErrors').ValidationError;

/**
 * Validates a JSON schema and returns a promise.
 *
 * @param {Object} request The request object.
 * @param {Object} schema A JSON Schema.
 * @return {Object} A Promise.
 */
module.exports.validate = function(request, schema) {
    return new Promise(function(resolve, reject) {
        var result = new ValidationResult(tv4.validateMultiple(request, schema, false, config.get('banUnknownProperties')));
        if (!result.valid) {
            reject(new ValidationError(result.errors));
        } else {
            resolve(result);
        }
    });
}

/**
 * Creates a new Validation Result.
 *
 * The constructor can be initialized with another validation result.
 *
 * @param {Object} [result] An optional validation result.
 */
var ValidationResult = function(result) {
    this.errors = [];
    this.valid = true;
    if (result && result.errors) {
        for (var i = 0, max = result.errors.length; i < max; i++) {
            this.addError(result.errors[i]);
        }
    }
};

/**
 * Adds an error, if any, to the validation result. If the error is non-empty it is added to the existing
 * collection of errors and sets `ValidationResult.valid == false`.
 *
 * @param {Object} [error] An error object.
 */
ValidationResult.prototype.addError = function(error) {
    if (error) {
        this.errors.push(sanitizeError(error));
        this.valid = false;
    }
};

/**
 * Adds errors, if any, to the validation result. If the error is non-empty it is added to the existing collection
 * of errors and sets `ValidationResult.valid == false`.
 *
 * @param {Object[]} [errors] An array of errors.
 */
ValidationResult.prototype.addErrors = function(errors) {
    if (errors && errors.length > 0) {
        for (var i = 0, max = errors.length; i < max; i++) {
            this.addError(errors[i]);
        }
    }
};

/**
 * Replaces numeric error codes used by the tv4 library with a more human readable string-based code and
 * removes error details we don't want to expose publicly.
 *
 * @param {Object} error The error object.
 */
function sanitizeError(error) {
    delete error.stack;
    delete error.subErrors;
    delete error.schemaPath;

    // Replace 'tv4'-library numeric codes with something more readable
    if (error.code === 0 || (typeof error.code === 'number' && error.code % 1 === 0)) { // Check if code is number
        error.code = findErrorName(error.code);
    }
    return error;
}


/**
* The 'tv4' library returns status codes; in our validation result we map these to more human-readable strings.
*
* @param {int} code The error code.
* @return {String} The error code name or the original code when not found.
*/
function findErrorName(code) {
    for (var property in tv4.errorCodes) {
        if (tv4.errorCodes.hasOwnProperty(property)) {
            if (tv4.errorCodes[property] == code) {
                return property;
            }
        }
    }
    return code;
}

module.exports.ValidationResult = ValidationResult;
