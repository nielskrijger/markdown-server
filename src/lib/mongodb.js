'use strict';

var BPromise = require('bluebird');
var mongodb = require('mongodb');
var DatabaseError = require('./RestErrors').DatabaseError;
BPromise.promisifyAll(mongodb);
var mongoClient = mongodb.MongoClient;
var collection = mongodb.Collection;

collection.prototype._find = collection.prototype.find;
collection.prototype.find = function() {
    var cursor = this._find.apply(this, arguments);
    cursor.toArrayAsync = BPromise.promisify(cursor.toArray, cursor);
    cursor.countAsync = BPromise.promisify(cursor.count, cursor);
    return cursor;
}

var mongo = {

    conn: null,

    connection: function() {
        return this.conn;
    },

    isConnected: function() {
        return this.conn !== null;
    },

    collection: function(collectionName) {
        return this.conn.collection(collectionName);
    },

    connect: function(connectionString) {
        if (!this.isConnected()) {
            var self = this;
            return mongoClient.connectAsync(connectionString)
                .then(function(db) {
                    self.conn = db;
                })
                .catch(function(e) {
                    throw e;
                });
        } else {
            return Promise.throw(new Error('Already connected'));
        }
    }
};

module.exports = mongo;
