var waterfall = require('run-waterfall');
var http = require('http');
var serveStatic = require('ecstatic');
var fs = require('fs');

var servePublic = serveStatic({  root: __dirname + '/public', autoIndex: true });
var serveAppTemplates = serveStatic({ root: __dirname + '/src/lib' });
var serveLibTemplates = serveStatic({  root: __dirname + '/src/app' });

var server = http.createServer(handleRequest);

function handleRequest(req, res, cb) {
    waterfall([
        function (next) {
            servePublic(req, res, next);
        },

        function (next) {
            serveAppTemplates(req, res, next);
        },

        function (next) {
            serveLibTemplates(req, res, next);
        },

        function getAppConfig(next) {
            if (/[\/]?config\.json$/.test(req.url)) {
                res.writeHead(200);
                fs.createReadStream(__dirname + '/config.json').pipe(res);
                return;
            }

            next();
        },

        function (next) {
            res.writeHead(404);
            res.end();
            next(new Error('Not found'));
        }
    ], cb);
}

var PORT = process.env.PORT || 5000;
console.log('\033c');
console.log('Listening on ', PORT);

module.exports = server.listen(PORT);
