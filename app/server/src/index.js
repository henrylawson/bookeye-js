var express = require("express");
var path = require('path');
var basicRouter = require('./basic.router');

this.start = function(settings) {
	var app = express();

	app.configure(function(){
		app.use(express.json({limit: '50mb'}));
		app.use(express.urlencoded({limit: '50mb'}));
		app.use(express.methodOverride());
		app.use(express.bodyParser({limit: '50mb'}));
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

	if (process.env.DEVELOPMENT) {
		app.configure('development', function(){
			app.get('/test', basicRouter.test);
			app.use('/specs', express.static(path.join(settings.clientDir, 'specs')));
			app.use('/test/factories', express.static(path.join(settings.clientDir, 'test', 'factories')));
			app.use(express.errorHandler({
				dumpExceptions: true, 
				showStack: true
			}));
		});
	}

	app.listen(settings.port);

	console.log('Running on 127.0.0.1:' + settings.port);
}