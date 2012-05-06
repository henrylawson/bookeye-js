var templateLoader = require('./src/template.loader');
var express = require("express");
var path = require('path');

var settings = {
	currentDir: __dirname,
	clientDir: path.join(__dirname, 'client'),
	port: 4567
};

var app = express.createServer();

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.static(path.join(settings.currentDir, 'public')));
	app.use('/src', express.static(path.join(settings.clientDir, 'src')));
	app.use(app.router);
	app.use(express.errorHandler({
		dumpExceptions: false, 
		showStack: false
	}));
	app.get("/", function(req, res) {
		res.end(templateLoader.insertAfterHead(path.join(settings.clientDir, 'html', 'index.html'), path.join(settings.clientDir, 'templates')));
	});
});

app.configure('development', function(){
	app.get('/test', function(req, res) {
		res.end(templateLoader.insertAfterHead(path.join(settings.clientDir, 'test', 'index.html'), path.join(settings.clientDir, 'templates')));
	});
	app.use('/specs', express.static(path.join(settings.clientDir, 'specs')));
	app.use('/test/factories', express.static(path.join(settings.clientDir, 'test', 'factories')));
	app.use(express.errorHandler({
		dumpExceptions: true, 
		showStack: true
	}));
});

app.listen(settings.port);

console.log('Running on 127.0.0.1:' + settings.port);