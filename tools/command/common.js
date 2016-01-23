'use strict';
/* jshint node: true */

var path = require('path');
var fs = require('fs');
var tmpl = require('lodash-template');

function writeFile (dir, file, text) {
    fs.writeFileSync(path.join(dir, file), text);
}

function readFile (dir, file) {
    return fs.readFileSync(path.join(process.cwd(), dir, file), 'utf8');
}

function getTemplate (file) {
    var tplPath = resolveTemplatePath(file);
    var template = fs.readFileSync(path.join(tplPath, file), 'utf8');

    return tmpl(template);
}

function resolveTemplatePath (file) {
    var p;
    var projectPath = path.join(process.cwd(), 'templates');
    var defaultPath = '/../templates/';

    p = path.join(projectPath, file);

    if (fs.existsSync(p)) {
        return projectPath;
    }

    return defaultPath;
}

function toCamelCase (str) {
    str = str.replace(/(-[a-z0-9])+/g, function(_, match) {
        return match.slice(1).toUpperCase();
    });

    return str.charAt(0).toUpperCase() + str.slice(1);
}

function mkdir (dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

module.exports = {
    writeFile: writeFile,
    readFile: readFile,
    mkdir: mkdir,
    getTemplate: getTemplate,
    toCamelCase: toCamelCase
};