var BooksController = function(options) {
	this.options = options;
	this.stateOptions = null;
}
BooksController.prototype.all = function(options) {
	this.stateOptions = options || this.stateOptions;
	this.options.widgets.title.display(this.stateOptions.title);
	var books = this.options.repository.getAll(this.stateOptions.repository);
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
			move: function(bookToSwapWith, book) {
				booksController.move(bookToSwapWith, book);
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
BooksController.prototype.add = function() {
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
BooksController.prototype.move = function(bookToSwapWith, book) {
	this.options.repository.move(bookToSwapWith, book, this.stateOptions.repository.key);
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

var LookupBooksController = function(options) {
	this.options = options;
}
LookupBooksController.prototype.quickAdd = function(book) {
	var lookupBooksController = this;
	this.options.view.quickAdd({
		displayElement: this.options.displayElements.quickAdd,
		callbacks: {
			search: function (searchTerm) {
				lookupBooksController.search(searchTerm);
			},
			cancel: function() {
			},
		}
	});
}
LookupBooksController.prototype.search = function(searchTerm) {
	var lookupBooksController = this;
	this.options.service.search({ 
		searchTerm: searchTerm,
		callbacks: {
			success: function(book) {
				lookupBooksController.searchResult(book)
			}
		},
		messages: {
			success: "Lookup books returned results",
			error: "Lookup books did not return any results"
		}
	});
}
LookupBooksController.prototype.searchResult = function(book) {
	var lookupBooksController = this;
	this.options.view.searchResult({
		book: book,
		displayElement: this.options.displayElements.quickAdd,
		callbacks: {
			add: function() {
				lookupBooksController.options.controllers.books.add(book)
			},
			cancel: function() {
			},
		}
	});
}