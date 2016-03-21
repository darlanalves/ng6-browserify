'use strict';
/* jshint node:true */
var isSSL = process.env.SSL;
var baseDir = process.cwd();
var http = require('http');
var https = require('https');

function createServer(handler) {
    if (isSSL) {
        var fs = require('fs');
        var keyFile = baseDir + '/key.pem';
        var certFile = baseDir + '/cert.pem';

        var hasCertificate = fs.existsSync(keyFile) && fs.existsSync(certFile);

        if (!hasCertificate) {
            console.log(
                'SSL Certificate not found!\n' +
                'To generate a local SSL certificate, go to http://www.selfsignedcertificate.com/' +
                'or run these commands:\n\n' +

                'openssl genrsa -out key.pem 2048\n' +
                'openssl req -new -x509 -key key.pem -out cert.pem -days 3650 -subj /CN={cert.domain.here}\n\n'
            );
            process.exit(1);
        }

        var sslOptions = {
            key: fs.readFileSync(keyFile),
            cert: fs.readFileSync(certFile)
        };

        return https.createServer(sslOptions, handler);
    }

    return http.createServer(handler);
}

module.exports = function (port, handler) {
    if (!handler) {
        var serveStatic = require('ecstatic');
        handler = serveStatic({ root: baseDir + '/public', autoIndex: true });
    }

    var server = createServer(handler);
    var PORT = port || process.env.PORT || 5000;
    console.log((isSSL ? '<https>' : '<http>') + ' Listening on', PORT);
    server.listen(PORT);
};
