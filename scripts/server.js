var templateLoader = require('./template.loader');
var express = require("express");
var path = require('path');

var settings = {
	staticDir: path.join(__dirname, '..', 'app'),
	port: 4567
};

var app = express.createServer();

app.get("/", function(req, res) {
	res.end(templateLoader.insertAfterHead(path.join(settings.staticDir, 'index.html'), path.join(settings.staticDir, 'templates')));
});

app.get('/test', function(req, res) {
	res.end(templateLoader.insertAfterHead(path.join(settings.staticDir, 'test', 'index.html'), path.join(settings.staticDir, 'templates')));
});

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.static(settings.staticDir));
	app.use(express.errorHandler({
		dumpExceptions: true, 
		showStack: true
	}));
	app.use(app.router);
});

app.listen(settings.port);

console.log('Running on 127.0.0.1:' + settings.port);
console.log('Serving static content from:\n' + settings.staticDir);