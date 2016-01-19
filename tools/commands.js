'use strict';
/* jshint node: true */

function createComponent (done) {
    ask('Component name: ', function (answer) {
        if (answer) {
            return writeComponent(answer);
        }

        done();
    });

    function writeComponent (name) {
        var _ = require('./command/create-component.js');
        _.createComponent(name, done);
    }
}

function createService (done) {
    var context = {};

    ask('Service domain (e.g. user): ', function (answer) {
        if (!answer) return done();

        context.domain = answer;

        ask('Service name: ', function (answer) {
            if (!answer) return done();

            context.name = answer;
            writeService();
        });
    });

    function writeService () {
        var _ = require('./command/create-service.js');
        _.createService(context, done);
    }
}

function createModule (done) {
    var context = {};

    ask('Module name: ', function (name) {
        if (!name) return done();

        context.name = name;
        writeModule();
    });

    function writeModule () {
        var name = context.name;
        var _ = require('./command/create-module.js');
        _.createModule(name, done);
    }
}

function ask (prompt, callback) {
    var readline = require('readline');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(prompt, function(answer) {
        rl.close();
        callback(answer);
    });
}

module.exports = {
    createComponent: createComponent,
    createModule: createModule,
    createService: createService
};
