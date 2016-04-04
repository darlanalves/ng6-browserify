/* jshint node: true */
var baseDir = process.cwd();

module.exports = function(config) {
    'use strict';

    config.set({
        reporters: ['jasmine-diff', 'dots'],
        browsers: ['PhantomJS'],
        frameworks: ['browserify', 'jasmine'],

        files: [],

        preprocessors: {
            'src/**/*.spec.js': ['browserify'],
            'mock/*.js': ['browserify'],
            'test/*.js': ['browserify']
        },

        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            }
        },

        watchify: {
            poll: true
        },

        browserify: {
            paths: [],
            basedir: baseDir,
            debug: true,
            transform: [
                'stringify',
                'babelify'
            ]
        }
    });
};
