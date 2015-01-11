/**
* @file This module simlifies building a collection resource representation.
* @author Niels Krijger
*/

'use strict';

var url = require('url');
var util = require('util');
var LinksBuilder = require('./LinksBuilder');

/**
 * @param {String} requestUrl The current request url.
 * @param {Object[]} items Array of item objects.
 * @param {int} offset
 * @param {int} limit
 * @param {int} defaultLimit
 * @param {int} total
 */
function CollectionRepresentation(requestUrl, items, offset, limit, defaultLimit, total) {
    this.url = requestUrl;
    this.items = items;
    this.offset = offset;
    this.limit = limit;
    this.total = total;
    this.defaultLimit = defaultLimit;
}

module.exports = CollectionRepresentation;

/**
 * @param {Function} representationFunction
 */
CollectionRepresentation.prototype.representation = function (representationFunction) {
    var representation = {
        items: [],
        meta: {
            total: this.total,
            size: this.items.length,
            offset: this.offset,
            limit: this.limit
        },
        links: new LinksBuilder(this.url).paginate(this.defaultLimit, this.total).build()
    };
    for (var i = 0, max = this.items.length; i < max; i++) {
        representation.items[i] = representationFunction(this.items[i]);
    }
    return representation;
}
