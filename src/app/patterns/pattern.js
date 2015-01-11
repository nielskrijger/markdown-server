'use strict';

var moment = require('moment');
var log = require('../../lib/logger');
var schemaValidator = require('../../lib/schemaValidator');
var patternModel = require('../models/pattern');
var patternSchema = require('./schema.json');
var queryRequestSchema = require('./searchRequest.json');
var CollectionRepresentation = require('../../lib/CollectionRepresentation');

module.exports.postPattern = function(req, res, next) {
    schemaValidator.validate(req.body, patternSchema)
        .then(function() {
            return patternModel.create(req.body);
        })
        .then(function(pattern) {
            res.setHeader('Location', '/api/patterns/' + pattern._id);
            res.status(201).json(patternResponse(pattern));
            log.debug({ message: 'Created new pattern', object: pattern });
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
    if (req.query.offset === undefined) {
        req.query.offset = 0;
    }
    if (req.query.limit === undefined) {
        req.query.limit = 10;
    }
    schemaValidator.validate(req.body, queryRequestSchema)
        .then(function() {
            return patternModel.search(req.query.offset, req.query.limit);
        })
        .then(function(patterns) {
            var repr = new CollectionRepresentation(req.url, patterns, req.query.offset, req.query.limit, 10, 0);
            res.status(200).json(repr.representation(patternResponse));
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
