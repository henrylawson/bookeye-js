var templateLoader = require('./template.loader');
var path = require('path');
var fileSystem = require('fs');

var settings = {
	clientDir: path.join(__dirname, '..', 'client'),
	booksFilePath: path.join(__dirname, '..', 'data', 'books.json')
}

this.index = function(req, res) {
	res.end(templateLoader.insertAfterHead(path.join(settings.clientDir, 'html', 'index.html'), path.join(settings.clientDir, 'templates')));
}

this.test = function(req, res) {
	res.end(templateLoader.insertAfterHead(path.join(settings.clientDir, 'test', 'index.html'), path.join(settings.clientDir, 'templates')));
}

this.postBooks = function(req, res) {
	var booksJsonFileDir = path.dirname(settings.booksFilePath);
	if (!path.existsSync(booksJsonFileDir)) {
		fileSystem.mkdirSync(booksJsonFileDir);
	}
	var booksJson = req.param('books', []);
	var booksString = JSON.stringify(booksJson, null, 2);
	fileSystem.writeFile(settings.booksFilePath, booksString);
	res.send(booksJson);
}

this.getBooks = function(req, res) {
	if (path.existsSync(settings.booksFilePath)) {
		var booksString = fileSystem.readFileSync(settings.booksFilePath);
		var booksJson = JSON.parse(booksString);
		res.send(booksJson);
	}
	res.send([]);
}