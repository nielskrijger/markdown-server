'use strict';

var app = require('express')();
var bodyParser = require('body-parser');
var compression = require('compression');
var config = require('./lib/config');
var mongodb = require('./lib/mongodb');
var patterns = require('./app/patterns');
var log = require('./lib/logger');
var dbInit = require('./app/models/init');
var ResourceNotFoundError = require('./lib/RestErrors').ResourceNotFoundError;

/* Keep here for now
// Create restify server
var server = restify.createServer({
    formatters: {
        // Parse json manually to allow custom error format
        'application/json': function customizedFormatJSON(req, res, body) {
            if (body instanceof Error) {
                res.statusCode = body.status || 500;
                body = body;
            } else if (Buffer.isBuffer(body)) {
                body = body.toString('base64');
            }
            var data = JSON.stringify(body);
            res.setHeader('Content-Length', Buffer.byteLength(data));
            return data;
        }
    }
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
*/

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

/*
// Page not found (404)
server.on('NotFound', function(req, res) {
    if (req.accepts('json')) {
        res.send(new ResourceNotFoundError('Resource not found'));
    } else {
        res.contentType = 'text/html';
        res.send('404: Resource not found');
    }
});
*/

app.use(function(req, res, next){
    res.status(404).json('Page not found');
});

function initApplication() {
    return mongodb.connect(config.get('mongodb.url'))
        .then(function() {
            log.info('Creating MongoDB indexes when required');
            return dbInit();
        })
        .then(function() {
            return app.listen(3000, function() {
                var host = this.address().address;
                var port = this.address().port;

                log.info('Application listening on http://%s:%s', host, port);
            });
        })
        .catch(function(e) {
            log.error('An error occurred during initialization', e);
        });
}

module.exports = initApplication();
