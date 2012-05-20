var BooksController = function(options) {
	this.options = options;
	this.stateDetails = null;
}
BooksController.prototype.all = function(details) {
	this.stateDetails = details || this.stateDetails;
	this.options.widgets.title.display(this.stateDetails);
	var books = this.options.repository.getAll(this.stateDetails.filter);
	var booksController = this;
	this.options.view.all({
		displayElement: this.options.displayElements.all, 
		callbacks: {
			edit: function(book) { 
				booksController.edit(book) 
			},
			delete: function(book) {
				booksController.deleteConfirm(book);
			},
			move: function(isUpMove, book) {
				booksController.move(isUpMove, book);
			}
		},
		books: books
	});
}
BooksController.prototype.deleteConfirm = function(book) {
	var booksController = this;
	this.options.view.deleteConfirm({
		displayElement: this.options.displayElements.deleteConfirm, 
		callbacks: {
			delete: function(book) { 
				booksController.delete(book);
			},
			cancel: function() {
			}
		}, 
		book: book
	});
}
BooksController.prototype.edit = function(book) {
	var booksController = this;
	this.options.view.form({
		displayElement: this.options.displayElements.form, 
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
BooksController.prototype.new = function() {
	var booksController = this;
	this.options.view.form({
		displayElement: this.options.displayElements.form, 
		callbacks: {
			save: function(book) { 
				booksController.save(book) 
			},
			cancel: function() {
			}
		}
	});
}
BooksController.prototype.move = function(isUpMove, book) {
	this.options.repository.move(isUpMove, book, this.stateDetails);
	this.all();
}
BooksController.prototype.delete = function(book) {
	this.options.repository.delete(book);
	this.all();
}
BooksController.prototype.save = function(book) {
	this.options.repository.save(book);
	this.all();
}