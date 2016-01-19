/* jshint node: true */
module.exports = function(config) {
    'use strict';

    config.set({
        reporters: ['dots', 'coverage'],
        browsers: ['PhantomJS'],
        frameworks: ['browserify', 'jasmine'],

        files: [
            require.resolve('babel-polyfill/browser'),
            'node_modules/angular/angular.js',
            'mock/*.js',
            'test/fixtures.js',
            'src/**/*.spec.js',
            'test/logger.js',

            {
                pattern: 'test/fixture/*.json',
                watched: true,
                served: true,
                included: false
            }
        ],

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

        browserify: {
            paths: ['src/lib', 'src/app', 'mock', 'test'],
            basedir: __dirname,
            debug: true,
            transform: [
                'babelify',
                require('browserify-istanbul')({
                    ignore: ['**/src/**/*.spec.js', '**/mock/**', '**/test/**'],
                    defaultIgnore: true,
                    instrumenterConfig: { embedSource: true }
                })
            ]
        },

        coverageReporter: {
            dir: 'test/coverage/',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
    });
};
