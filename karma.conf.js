/* jshint node: true */
var baseDir = process.cwd();

module.exports = function(config) {
    'use strict';

    config.set({
        reporters: ['dots', 'coverage'],
        browsers: ['PhantomJS'],
        frameworks: ['browserify', 'jasmine'],

        files: [
            require.resolve('babel-polyfill/browser'),
            'node_modules/angular/angular.js',
            'test/fixtures.js',
            'src/**/*.spec.js',
            'test/*.js',

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

        watchify: {
            poll: true
        },

        browserify: {
            paths: ['src/lib', 'src/app', 'mock', 'test'],
            basedir: baseDir,
            debug: true,
            transform: [
                'stringify',
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
