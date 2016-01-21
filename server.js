'use strict';
/* jshint node:true */
var baseDir = process.cwd();
var http = require('http');
var serveStatic = require('ecstatic');
var servePublic = serveStatic({ root: baseDir + '/public', autoIndex: true });
var server = http.createServer(servePublic);

var PORT = process.env.PORT || 5000;
console.log('Listening on ', PORT);

module.exports = server.listen(PORT);
