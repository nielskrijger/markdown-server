'use strict';

var BPromise = require('bluebird');
var mongodb = BPromise.promisifyAll(require('mongodb'));
var mongoClient = mongodb.MongoClient;
var collection = mongodb.Collection;

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
                });
        } else {
            return Promise.throw(new Error('Already connected'));
        }
    }
};

module.exports = mongo;
