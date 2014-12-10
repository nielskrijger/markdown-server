'use strict';

var fs = require('fs');
var gulp = require('gulp-help')(require('gulp'));
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var plato = require('gulp-plato');
var clean = require('gulp-clean');

require('jshint-stylish');

gulp.task('lint', 'Lints all server side js', function() {
    return gulp.src([
        './*.js',
        'lib/***/*.js',
        'app/**/*.js',
        'test/**/*.js'
    ]).pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('plato', 'Generates code complexity, maintainability and style metrics', function() {
    return gulp.src(['app/**/*.js', 'lib/***/*.js', 'app.js'])
        .pipe(plato('report', {
            jshint: {
                options: JSON.parse(fs.readFileSync('.jshintrc')) // Plato doesn't read automatically from .jshintrc
            },
            complexity: {
                trycatch: true
            }
        }));
});

gulp.task('test', 'Runs all unit and API tests', function(cb) {
    gulp.src(['app/**/*.js', 'lib/**/*.js', 'app.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function() {
            gulp.src(['test/**/*.js'])
                .pipe(mocha({
                    reporter: 'spec',
                    timeout: 10000
                }))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov', 'json', 'text', 'text-summary']
                }))
                .on('end', cb);
        });
});

gulp.task('clean-reports', 'Removes code coverage and reporting files', function() {
    return gulp.src(['./coverage', './report'], {
        read: false
    }).pipe(clean({
        force: true
    }));
});

gulp.task('build', 'Runs lint, test and code coverage tasks', function(callback) {
    runSequence(
        'lint',
        'test',
        'clean-reports',
        'plato',
        function() {
            callback();

            // This is a hack, haven't been able to figure out why it doesn't close normally...
            process.exit(0);
        });
});


gulp.task('default', 'Default task', ['build']);
