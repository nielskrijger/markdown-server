'use strict';

var moment = require('moment');
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
            res.setHeader('Location', '/api/patterns/' + pattern._id);
            res.status(201).json(patternResponse(pattern));
            log.debug('Created new pattern', { object: pattern });
        })
        .catch(function(err) {
            return next(err);
        });
};

module.exports.getPattern = function(req, res, next) {
    patternModel.get(req.params.slug)
        .then(function(pattern) {
            res.status(200).json(patternResponse(pattern));
        })
        .catch(function(err) {
            return next(err);
        });
};

module.exports.getPatterns = function(req, res, next) {
    patternModel.search(0, 10)
        .then(function(patterns) {
            var response = {
                items: []
            };
            patterns.forEach(function(pattern) {
                response.items.push(patternResponse(pattern));
            });
            res.status(200).json(response);
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
        id: pattern._id,
        rev: pattern.rev,
        name: pattern.name,
        slug: pattern.slug,
        markdown: pattern.markdown,
        html: pattern.html,
        created: moment(pattern.created).utc().format()
    };
}
