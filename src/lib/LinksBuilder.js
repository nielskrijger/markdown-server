/**
* @file This module simlifies building links for resource representations. Resource links are useful for API
* discoverability and simplify client implementation.
* @author Niels Krijger
*/

'use strict';

var url = require('url');
var util = require('util');

/**
* @param {String} requestUrl The current request url.
*/
function LinksBuilder(requestUrl) {
    var request = url.parse(requestUrl, true);
    this._pathname = request.pathname;
    this._queryParams = request.query;
    this._defaultLimit = null;
    this._total = null;
}

module.exports = LinksBuilder;

/**
* Sets the default page limit when paginating. Calling this enables 'prev' and 'next' pagination links and will
* use 'limit' and 'offset' query parameters to create pagination links.
*
* @param {Number} defaultLimit The default maximum number of results.
* @param {Number} [total] The total number of results in the result set. When defined the Builder will check if any
* `next` links are needed.
* @return {LinksBuilder} This LinksBuilder to allow method chaining.
*/
LinksBuilder.prototype.paginate = function(defaultLimit, total) {
    if (isNaN(defaultLimit)) {
        throw new Error('Parameter `defaultLimit` is not a valid number');
    }
    if (total !== undefined && total !== null && isNaN(total)) {
        throw new Error('Parameter `total` is not a valid number');
    }
    this._defaultLimit = defaultLimit;
    this._total = total;
    return this;
};

/**
* Sets or overwrites an existing query parameter to the specified query value.
*
* @param {Object} parameter The query key.
* @param {Object} [value] The query value.
* @returns {LinksBuilder} This LinksBuilder to allow method chaining.
*/
LinksBuilder.prototype.setParam = function(parameter, value) {
    this._queryParams[parameter] = value;
    return this;
};

/**
* Returns the query parameter or `undefined` when not found.
*
* @param {String} field The parameter.
* @returns {Object} The parameter value.
*/
LinksBuilder.prototype.getParam = function(field) {
    return this._queryParams[field];
};

/**
* Returns an object with links to the current and related resources.
*
* @return {Object} An object with links to the current and related resources.
*/
LinksBuilder.prototype.build = function() {
    var result = {
        self: {
            href: this._pathname
        }
    };

    // TODO: method too long, split up

    // Set pagination links
    var params = 0;
    var isPaginated = this._defaultLimit !== null;
    if (isPaginated) {
        var limit = (!isNaN(parseInt(this.getParam('limit')))) ? parseInt(this.getParam('limit')) : this._defaultLimit;
        var offset = (!isNaN(parseInt(this.getParam('offset')))) ? parseInt(this.getParam('offset')) : 0;

        result.self.href += '?';
        var baseUrl = result.self.href;
        result.self.href += 'offset=' + offset + '&limit=' + limit;
        if (offset > 0) { // Only show `prev` link when there are previous results
            var prevOffset = (offset - limit > 0) ? (offset - limit) : 0;
            result.prev = {
                href: baseUrl + 'offset=' + prevOffset + '&limit=' + limit
            };
        }
        if (this._total === undefined || this._total === null || this._total > offset + limit) { // Only show `next` link when there are more results available
            result.next = {
                href: baseUrl + 'offset=' + (offset + limit) + '&limit=' + limit
            };
        }
        params++;
    }

    // Add query parameters to all links
    for (var property in this._queryParams) {
        if ((isPaginated && (property == 'limit' || property == 'offset')) || !this._queryParams.hasOwnProperty(property)) {
            continue; // continue when link is a pagination link or the property is inherited
        }
        for (var link in result) {
            if (result.hasOwnProperty(link)) {
                result[link].href += (params === 0) ? '?' : '&';
                if (this._queryParams[property]) {
                    result[link].href += property + '=' + this._queryParams[property];
                } else {
                    result[link].href += property;
                }
            }
        }
        params++;
    }
    return result;
};
