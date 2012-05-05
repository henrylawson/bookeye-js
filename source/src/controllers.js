var BooksController = function(booksView, booksService) {
	this.contentArea = "#content";
	this.booksView = booksView;
	this.booksService = booksService;
}
BooksController.prototype.all = function() {
	var books = this.booksService.getAll();
	var booksController = this;
	this.booksView.all('#books-view-all', this.contentArea, function(book) { 
		booksController.edit(book) 
	}, books);
}
BooksController.prototype.edit = function(book) {
	var booksController = this;
	this.booksView.form('#books-view-form', this.contentArea, function(book) { 
		booksController.save(book) 
	}, book);
}
BooksController.prototype.save = function(book) {
	this.booksService.save(book);
	this.all();
}
BooksController.prototype.new = function() {
	var booksController = this;
	this.booksView.form('#books-view-form', this.contentArea, function(book) { 
		booksController.save(book) 
	});
}