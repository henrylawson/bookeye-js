var BooksController = function(displayElement, booksView, booksRepository) {
	this.contentArea = displayElement;
	this.booksView = booksView;
	this.booksRepository = booksRepository;
}
BooksController.prototype.all = function() {
	var books = this.booksRepository.getAll();
	var booksController = this;
	this.booksView.all(this.contentArea, function(book) { 
		booksController.edit(book) 
	}, books);
}
BooksController.prototype.edit = function(book) {
	var booksController = this;
	this.booksView.form(this.contentArea, function(book) { 
		booksController.save(book) 
	}, book);
}
BooksController.prototype.save = function(book) {
	this.booksRepository.save(book);
	this.all();
}
BooksController.prototype.new = function() {
	var booksController = this;
	this.booksView.form(this.contentArea, function(book) { 
		booksController.save(book) 
	});
}