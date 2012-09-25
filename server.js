var server = require('./app/server/src/index');
var path = require('path');

server.start({
	currentDir: path.join(__dirname, 'app'),
	clientDir: path.join(__dirname, 'app', 'client'),
	port: (process.env.port || 4567)
});

