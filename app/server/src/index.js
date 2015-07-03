var express = require("express");
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var basicRouter = require('./basic.router');

this.start = function(settings) {
  var app = express();

  app.use(bodyParser.urlencoded({extended: true, parameterLimit: 100000, limit: '50mb'}));
  app.use(methodOverride());
  app.use(serveStatic(path.join(settings.currentDir, 'public')));
  app.use('/src', serveStatic(path.join(settings.clientDir, 'src')));

  if (process.env.DEVELOPMENT) {
    app.get('/test', basicRouter.test);
    app.use('/specs', serveStatic(path.join(settings.clientDir, 'specs')));
    app.use('/test/factories', serveStatic(path.join(settings.clientDir, 'test', 'factories')));
    app.use(errorhandler());
  }

  app.get("/", basicRouter.index);
  app.get("/books", basicRouter.getBooks);
  app.post("/books", basicRouter.postBooks);

  app.listen(settings.port);

  console.log('Running on 127.0.0.1:' + settings.port);
}
