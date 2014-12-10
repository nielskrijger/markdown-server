'use strict';

var BPromise = require('bluebird');
var util = require('util');
var slug = require('slug');
var markdown = require('markdown').markdown;
var DatabaseError = require('../../lib/RestErrors').DatabaseError;
var db = require('../../lib/mongodb');

module.exports.create = function(pattern) {
    pattern.slug = slug(pattern.name).toLowerCase();
    pattern.rev = 0;
    pattern.html = markdown.toHTML(pattern.markdown);
    pattern._id = generateId(pattern);
    return db.collection('patterns')
        .insertAsync(pattern)
        .then(function(records) {
            return records[0];
        })
        .catch(function(err) {
            throw new DatabaseError('Database error', err);
        });
};

function generateId(pattern) {
    return pattern.slug + ':' + pattern.rev;
}
