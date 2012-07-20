var server = require('./app/server/index');
var path = require('path');

server.start({
	currentDir: path.join(__dirname, 'app'),
	clientDir: path.join(__dirname, 'app', 'client'),
	port: (process.env.port || 4567)
});