var BooksController = function(options) {
	this.allDisplayElement = options.displayElements.all;
	this.formDisplayElement = options.displayElements.form;
	this.deleteDisplayElement = options.displayElements.deleteConfirm;
	this.booksView = options.view;
	this.booksRepository = options.repository;
}
BooksController.prototype.all = function() {
	var books = this.booksRepository.getAll();
	var booksController = this;
	this.booksView.all({
		displayElement: this.allDisplayElement, 
		callbacks: {
			edit: function(book) { 
				booksController.edit(book) 
			},
			delete: function(book) {
				booksController.deleteConfirm(book);
			},
		},
		books: books
	});
}
BooksController.prototype.deleteConfirm = function(book) {
	var booksController = this;
	this.booksView.deleteConfirm({
		displayElement: this.deleteDisplayElement, 
		callbacks: {
			delete: function(book) { 
				booksController.booksRepository.delete(book);
				booksController.all();
			},
			cancel: function() {
			}
		}, 
		book: book
	});
}
BooksController.prototype.edit = function(book) {
	var booksController = this;
	this.booksView.form({
		displayElement: this.formDisplayElement, 
		callbacks: {
			save: function(book) { 
				booksController.save(book) 
			},
			cancel: function() {
			}
		}, 
		book: book
	});
}
BooksController.prototype.save = function(book) {
	this.booksRepository.save(book);
	this.all();
}
BooksController.prototype.new = function() {
	var booksController = this;
	this.booksView.form({
		displayElement: this.formDisplayElement, 
		callbacks: {
			save: function(book) { 
				booksController.save(book) 
			},
			cancel: function() {
			}
		}
	});
}