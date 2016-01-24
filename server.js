'use strict';
/* jshint node:true */
var baseDir = process.cwd();
var http = require('http');
var serveStatic = require('ecstatic');
var servePublic = serveStatic({ root: baseDir + '/public', autoIndex: true });
var server = http.createServer(servePublic);

module.exports = function (port) {
    var PORT = port || process.env.PORT || 5000;
    console.log('Listening on ', PORT);
    server.listen(PORT);
};
