'use strict';

var mongoClient = require('mongodb').MongoClient;
var collection = require('mongodb').Collection;
var Promise = require('bluebird');

Promise.promisifyAll(collection.prototype);
Promise.promisifyAll(mongoClient);

var mongodb = {

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
                });
        } else {
            return Promise.throw(new Error('Already connected'));
        }
    }
};

module.exports = mongodb;
