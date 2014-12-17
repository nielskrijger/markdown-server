'use strict';

var fs = require('fs');
var gulp = require('gulp-help')(require('gulp'));
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var mocha = require('gulp-spawn-mocha');
var istanbul = require('gulp-istanbul');
var plato = require('gulp-plato');
var clean = require('gulp-clean');
var coveralls = require('gulp-coveralls');

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
    return gulp
        .src(['test/**/*.js'])
        .pipe(mocha({
            istanbul: true
        }));
});

gulp.task('coveralls', 'Pushes coverage data to coveralls.io', function() {
    return gulp.src('coverage/lcov.info')
        .pipe(coveralls());
});

gulp.task('clean-reports', 'Removes code coverage and reporting files', function() {
    return gulp.src(['./coverage', './report'], {
        read: false
    }).pipe(clean({
        force: true
    }));
});

gulp.task('build', 'Runs lint, tests, code coverage and metric reports', function(callback) {
    runSequence(
        'lint',
        'clean-reports',
        'test',
        'plato',
        callback);
});

gulp.task('build-coverage', 'Same as build but sends coverage data to coveralls as well', function(callback) {
    runSequence(
        'build',
        'coveralls',
        callback);
});

gulp.task('default', 'Default task', ['build']);
