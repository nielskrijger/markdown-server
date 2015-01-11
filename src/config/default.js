'use strict';

var os = require('os');

module.exports = {
    "env": {
        "doc": "The applicaton environment.",
        "format": ["development", "test", "production"],
        "default": "development",
        "env": "NODE_ENV"
    },
    "port": {
        "doc": "The port to bind to.",
        "format": "port",
        "default": 3000,
        "env": "PORT"
    },
    "banUnknownProperties": {
        "doc": "All unknown request properties raise an error during validation.",
        "default": true
    },
    "mongodb": {
        "url": {
            "doc": "The mongodb connection uri.",
            "format": "*",
            "default": "mongodb://db:27017/patterncatalog",
            "env": "MONGODB_URL"
        },
        "writeConcern": {
            "doc": "MongoDB writeconcern setting.",
            "format": "*",
            "default": "1"
        },
        "createIndexInBackground": {
            "doc": "Builds indexes in the background, this is particularly useful for production databases.",
            "default": false
        }
    },
    "log": {
        "stdout": {
            "level": {
                "doc": "Log everything from this level and above. Set 'none' to disable the log stream.",
                "format": ["none", "verbose", "debug", "info", "warn", "error"],
                "default": "none",
                "env": "LOG_STDOUT_LEVEL"
            }
        },
        "loggly": {
            "level": {
                "doc": "Log everything from this level and above. Set to 'none' to disable the log stream.",
                "format": ["none", "verbose", "debug", "info", "warn", "error"],
                "default": "info",
                "env": "LOGGLY_LEVEL"
            },
            "token": {
                "doc": "The loggly token.",
                "default": "",
                "env": "LOGGLY_TOKEN"
            },
            "subdomain": {
                "doc": "The loggly subdomain.",
                "default": "",
                "env": "LOGGLY_SUBDOMAIN"
            },
            "tags": {
                "doc": "An array of tags to send to loggly with each log request",
                "default": [os.hostname(), "patterncatalog"],
                "format": Array,
                "env": "LOGGLY_TAGS"
            }
        }
    }
};
