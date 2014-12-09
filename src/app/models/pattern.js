'use strict';

var error = require('../../lib/error');
var db = require('../../lib/mongodb');

module.exports.create = function(pattern) {
    return db.collection('patterns')
        .insertAsync(pattern)
        .catch(function(err) {
            throw new error.DatabaseError('Database error', err);
        })
};
