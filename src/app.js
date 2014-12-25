'use strict';

var app = require('express')();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var config = require('./lib/config');
var mongodb = require('./lib/mongodb');
var patterns = require('./app/patterns');
var log = require('./lib/logger');
var dbInit = require('./app/models/init');

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// Log startup information
log.info('Server run mode: ' + config.get('env'));
log.info('Server port: ' + config.get('port'));
log.info('Server pid: ' + process.pid);
log.info('Server process title: ' + process.title);
log.info('Server node.js version: ' + process.version);
log.info('Server architecture: ' + process.platform);

// Routes
app.post('/api/patterns', patterns.postPattern);
app.get('/api/patterns/:slug', patterns.getPattern);
app.get('/api/patterns', patterns.getPatterns);

app.use(function(req, res, next) {
    // TODO return proper error with the same format as other errors
    res.status(404).json('Page not found');
});
app.use(logErrors);
app.use(errorHandler);

function logErrors(err, req, res, next) {
    if (err.status && err.status < 500) {
        log.info('Client error', { error: err });
    } else {
        log.error('Server error', { error: err });
    }
    next(err);
}

function errorHandler(err, req, res, next) {
    res.status(err.status);
    res.json(err);
}

function initApplication() {
    return mongodb.connect(config.get('mongodb.url'))
        .then(function() {
            log.info('Creating MongoDB indexes when required');
            return dbInit();
        })
        .then(function() {
            var server = app.listen(3000, function() {
                var host = this.address().address;
                var port = this.address().port;

                log.info('Application listening on http://%s:%s', host, port);
            });
            function exitHandler() {
                log.info('Shutting down application server, waiting for HTTP connections to finish');
                server.close(function () {
                    mongodb.connection().close(function() {
                        log.info('Server stopped');
                        process.exit(0);
                    });
                });
            }
            process.on('SIGINT', exitHandler);
            process.on('SIGTERM', exitHandler);
            return server;
        })
        .catch(function(e) {
            log.error('An error occurred during initialization', e);
        });
}

module.exports = initApplication();
