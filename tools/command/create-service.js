'use strict';
/* jshint node: true */

var _ = require('./common');

function createService (params, done) {
    var name = params.name;
    var className = _.toCamelCase(name) + 'Service';

    var context = {
        name: name,
        className: className
    };

    var spec = getTemplate('service.spec.js')(context);
    var cmp = getTemplate('service.js')(context);

    var targetDir = 'src/lib/' + params.domain;

    _.mkdir(targetDir);
    _.writeFile(targetDir, name + '.service.js',      cmp);
    _.writeFile(targetDir, name + '.service.spec.js', spec);

    done();
}

function getTemplate (file) {
    return _.getTemplate(file);
}

module.exports.createService = createService;