'use strict';

var BPromise = require('bluebird');
var util = require('util');
var slug = require('slug');
var uuid = require('node-uuid');
var markdown = require('markdown').markdown;
var moment = require('moment');
var DatabaseError = require('../../lib/RestErrors').DatabaseError;
var db = require('../../lib/mongodb');

module.exports.create = function(pattern) {
    pattern.slug = slug(pattern.name).toLowerCase();
    pattern.rev = 0;
    pattern.html = markdown.toHTML(pattern.markdown);
    pattern._id = uuid.v4();
    pattern.created = moment.utc().toDate();
    return db.collection('patterns')
        .insertAsync(pattern)
        .then(function(records) {
            return records[0];
        })
        .catch(function(err) {
            throw new DatabaseError('Database error', err);
        });
};

module.exports.get = function(slug) {
    var options = {
        'sort': ['rev', 'desc']
    };
    return db.collection('patterns')
        .findOneAsync({slug:slug}, options)
        .then(function(pattern) {
            return pattern;
        })
        .catch(function(err) {
            throw new DatabaseError('Database error', err);
        });
};

module.exports.search = function(offset, limit) {
    var options = {
        limit: limit,
        skip: offset,
        sort: ['created', 'desc']
    };
    return db.collection('patterns')
        .find({}, options)
        .toArrayAsync()
        .then(function(patterns) {
            return patterns;
        })
        .catch(function(err) {
            throw new DatabaseError('Database error', err);
        });
};
