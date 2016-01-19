'use strict';
/* jshint node: true */

var path = require('path');
var fs = require('fs');
var tmpl = require('lodash-template');

function writeFile (dir, file, text) {
    fs.writeFileSync(path.join(dir, file), text);
}

function readFile (dir, file) {
    return fs.readFileSync(path.join(__dirname, dir, file), 'utf8');
}

function getTemplate (file) {
    var template = readFile('/../templates/', file);
    return tmpl(template);
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