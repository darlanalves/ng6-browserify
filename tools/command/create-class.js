'use strict';
/* jshint node: true */

var _ = require('./common');

function createClass (params, done) {
    var name = params.name;
    var className = _.toCamelCase(name);

    var context = {
        name: name,
        className: className
    };

    var spec = getTemplate('class.spec.js')(context);
    var cmp = getTemplate('class.js')(context);

    var targetDir = 'src/' + params.domain;

    _.mkdir(targetDir);
    _.writeFile(targetDir, name + '.js',      cmp);
    _.writeFile(targetDir, name + '.spec.js', spec);

    done();
}

function getTemplate (file) {
    return _.getTemplate(file);
}

module.exports.createClass = createClass;