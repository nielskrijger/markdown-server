'use strict';

var log = require('../../lib/logger');
var patternModel = require('../models/pattern');

module.exports.postPattern = function(req, res, next) {
    patternModel.create(req.body)
        .then(function(result) {
            res.setHeader('Location', '/patterns/' + result.id);
            res.json(201, 'test');
            log.debug('Created new Pattern', result);
        })
        .catch(function(err) {
            return next(err);
        })
};
