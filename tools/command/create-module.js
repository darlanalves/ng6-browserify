'use strict';
/* jshint node: true */

var _ = require('./common');

function createModule(name, done) {
    var content = getModuleTemplate(name);
    var targetDir = 'src/lib/' + name;

    _.mkdir(targetDir);
    _.writeFile(targetDir, 'module.js', content);

    done();
}

function getModuleTemplate(name) {
    var template = _.getTemplate('module.js');
    return template({ moduleName: _.toCamelCase(name) });
}

module.exports.createModule = createModule;
