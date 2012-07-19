var basicRouter = require('./app/server/basic.router');
var express = require("express");
var path = require('path');

var settings = {
	currentDir: path.join(__dirname, 'app'),
	clientDir: path.join(__dirname, 'app', 'client'),
	port: (process.env.port || 4567)
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
	app.get("/", basicRouter.index);
	app.get("/books", basicRouter.getBooks);
	app.post("/books", basicRouter.postBooks);
});

app.configure('development', function(){
	app.get('/test', basicRouter.test);
	app.use('/specs', express.static(path.join(settings.clientDir, 'specs')));
	app.use('/test/factories', express.static(path.join(settings.clientDir, 'test', 'factories')));
	app.use(express.errorHandler({
		dumpExceptions: true, 
		showStack: true
	}));
});

app.listen(settings.port);

console.log('Running on 127.0.0.1:' + settings.port);