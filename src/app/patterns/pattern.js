'use strict';

var log = require('../../lib/logger');
var schemaValidator = require('../../lib/schemaValidator');
var patternModel = require('../models/pattern');
var schema = require('./schema.json');

module.exports.postPattern = function(req, res, next) {
    schemaValidator.validate(req.body, schema)
        .then(function() {
            return patternModel.create(req.body);
        })
        .then(function(pattern) {
            res.setHeader('Location', '/api/patterns/' + pattern.slug);
            res.json(201, patternResponse(pattern));
            log.debug({ msg: 'Created new Pattern', object: pattern });
        })
        .catch(function(err) {
            return next(err);
        });
};

/**
 * Generates a pattern response object from a database object.
 *
 * @param {Object} pattern The MongoDB document.
 * @return {Object} A response object.
 */
function patternResponse(pattern) {
    return {
        name: pattern.name,
        rev: pattern.rev,
        markdown: pattern.markdown,
        slug: pattern.slug,
        html: pattern.html
    };
}
