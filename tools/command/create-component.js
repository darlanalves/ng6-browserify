'use strict';
/* jshint node: true */

var _ = require('./common');
var path = require('path');

var componentDir = 'src/lib/component/';

function createComponent (name, done) {
    var className = _.toCamelCase(name);

    var context = {
        name: name,
        className: className
    };

    var html = _.getTemplate('component.html')(context);
    var sass = _.getTemplate('component.scss')(context);
    var spec = _.getTemplate('component.spec.js')(context);
    var cmp =  _.getTemplate('component.js')(context);

    var targetDir = path.join(componentDir, name);

    _.mkdir(componentDir);
    _.mkdir(targetDir);
    _.writeFile(targetDir, name + '.js',      cmp);
    _.writeFile(targetDir, name + '.spec.js', spec);
    _.writeFile(targetDir, name + '.html',    html);
    _.writeFile(targetDir, name + '.scss',    sass);

    done();
}

module.exports.createComponent = createComponent;