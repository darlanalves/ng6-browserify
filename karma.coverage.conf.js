/* jshint node: true */
module.exports = function(config) {
    'use strict';

    require('./karma.conf')(config);

    var istanbul = require('browserify-istanbul')({
        ignore: ['**/src/**/*.spec.js', '**/*.html', '**/mock/**', '**/test/**'],
        defaultIgnore: true,
        instrumenterConfig: { embedSource: true }
    });

    config.set({
        reporters: ['jasmine-diff', 'dots', 'coverage'],
        coverageReporter: {
            dir: 'test/coverage/',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
    });

    // add to browserify transform list from karma.conf
    config.browserify.transform.push(istanbul);
};
