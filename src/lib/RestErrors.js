'use strict';

var util = require('util');

/**
 * The abstract exception for REST service errors.
 *
 * @class
 * @extends Error
 * @param {Number} httpStatus The HTTP status code (for example 404 Not Found, 400 Bad Request, etc).
 * @param {String} errorCode The error code.
 * @param {String} message The error message.
 */
function RestError(httpStatus, errorCode, message) {
    Error.call(this, message);
    this.status = httpStatus;
    this.code = errorCode;
    this.message = message;
}
util.inherits(RestError, Error);

module.exports.RestError = RestError;

/**
 * This error is thrown when a validation error occurred.
 *
 * @class
 * @extends RestError
 * @param {Object[]} errors An array containing one or more constraint violations.
 * @property {String} errors.code The error code.
 * @property {String} errors.message The validation error message.
 */
function ValidationError(errors) {
    RestError.call(this, 400, 'ValidationError', 'One or more request parameters are invalid');
    this.errors = errors;
}
util.inherits(ValidationError, RestError);

module.exports.ValidationError = ValidationError;

/**
 * ## ResourceExistsError
 * This error is thrown when a resource already exists.
 *
 * @class
 * @extends RestError
 * @param {String} message The error message.
 */
function ResourceExistsError(message) {
    RestError.call(this, 409, 'ResourceExistsError', message);
}
util.inherits(ResourceExistsError, RestError);

module.exports.ResourceExistsError = ResourceExistsError;

/**
 * This error is thrown when a pre-condition failed. This error is indicative for a coding error.
 *
 * @class
 * @extends RestError
 * @param {String} message The error message.
 */
 // TODO rename to AssertionError to make more clean its intent
function PreConditionError(message) {
    RestError.call(this, 500, 'PreConditionError', message);
}
util.inherits(PreConditionError, RestError);

module.exports.PreConditionError = PreConditionError;

/**
 * This error is thrown when a resource could not be found.
 *
 * @class
 * @extends RestError
 * @param {String} message The error message.
 */
function ResourceNotFoundError(message) {
    RestError.call(this, 404, 'ResourceNotFoundError', message);
}
util.inherits(ResourceNotFoundError, RestError);

module.exports.ResourceNotFoundError = ResourceNotFoundError;

/**
 * This error is thrown when an unexpected problem occurred while persisting the entity.
 *
 * @class
 * @extends RestError
 * @param {String} message The database error message.
 * @param {Object[]} [errors] A list of errors that occurred.
 */
function DatabaseError(message, errors) {
    RestError.call(this, 500, 'DatabaseError', message);
    if (errors) {
        this.errors = errors;
    }
}
util.inherits(DatabaseError, RestError);

module.exports.DatabaseError = DatabaseError;
