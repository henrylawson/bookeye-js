var BooksController = function(displayElement, booksView, booksRepository) {
	this.contentArea = displayElement;
	this.booksView = booksView;
	this.booksRepository = booksRepository;
}
BooksController.prototype.all = function() {
	var books = this.booksRepository.getAll();
	var booksController = this;
	this.booksView.all({
		displayElement: this.contentArea, 
		callbacks: {
			edit: function(book) { 
				booksController.edit(book) 
			},
			delete: function(book) {
				booksController.booksRepository.delete(book);
				booksController.all();
			},
		},
		books: books
	});
}
BooksController.prototype.edit = function(book) {
	var booksController = this;
	this.booksView.form({
		displayElement: this.contentArea, 
		callbacks: {
			save: function(book) { 
				booksController.save(book) 
			},
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
		displayElement: this.contentArea, 
		callbacks: {
			save: function(book) { 
				booksController.save(book) 
			}
		}
	});
}