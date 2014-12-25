'use strict';

var BPromise = require('bluebird');
var db = require('../../lib/mongodb');
var config = require('../../lib/config');
var DatabaseError = require('../../lib/RestErrors').DatabaseError;

module.exports = function(callback) {
    return BPromise.all([
        patternNameIndex(),
        patternSlugIndex(),
    ])
    .catch(function(err) {
        throw new DatabaseError('Database error', err);
    });
};

function patternNameIndex() {
    var options = {
        unique: true,
        background: config.get('mongodb.createIndexInBackground')
    };
    return db.collection('patterns').ensureIndexAsync({slug: 1}, options);
}

function patternSlugIndex() {
    var options = {
        unique: true,
        background: config.get('mongodb.createIndexInBackground')
    };
    return db.collection('patterns').ensureIndexAsync({created: -1}, options);
}
