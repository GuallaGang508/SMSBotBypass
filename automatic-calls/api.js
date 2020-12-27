var app = require('./app');
var config = require('./config');
var http = require('http');

/**
 * Côté serveur web HTTP lançant la partie EXPRESS
 */
var server = http.createServer(app);
server.listen(config.port, function() {
    console.log('Express server started on *:'+config.port);
});