'use strict';
/* jshint node: true */

function createComponent (done) {
    header();
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
    header();
    var context = {};

    ask('Service domain (e.g. user): ', function (answer) {
        if (!answer) return done();

        context.domain = answer;

        ask('Service name (e.g. user): ', function (answer) {
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

function createClass (done) {
    header();
    var context = {};

    ask('Class domain (e.g. user): ', function (answer) {
        if (!answer) return done();

        context.domain = answer;

        ask('Class name (e.g. user-avatar): ', function (answer) {
            if (!answer) return done();

            context.name = answer;
            writeService();
        });
    });

    function writeService () {
        var _ = require('./command/create-class.js');
        _.createClass(context, done);
    }
}

function createModule (done) {
    header();
    var context = {};

    ask('Module name (e.g. user): ', function (name) {
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

function header () {
    console.log('\n   Note: use dashed-case in your unit names and modules\n');
}

module.exports = {
    createComponent: createComponent,
    createModule: createModule,
    createService: createService,
    createClass: createClass
};
