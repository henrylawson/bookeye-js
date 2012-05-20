var BooksRepository = function(booksService) {
	this.booksService = booksService;
	this.books = [];
	var booksRepository = this;
	this.booksService.getAllBooksFromWebService(function(books) {
		booksRepository.books = books;
	});
}
BooksRepository.prototype.getAll = function(options) {
	var filter = this.determineFilter(options);
	var filteredBooks = BookFilter.filterAllBy(this.books, filter);
	return filteredBooks;
}
BooksRepository.prototype.determineFilter = function(options) {
	var filter = BookFilter.all;
	if (options) {
		filter = options.filter || BookFilter.all;
	}
	return filter;
}
BooksRepository.prototype.move = function(isMoveUp, book, options) {
	console.log(book);
	console.log(isMoveUp);
	console.log(options);
}
BooksRepository.prototype.save = function(book) {
	this.addBookIfNew(book);
	this.updateWebService();
	return book;
}
BooksRepository.prototype.delete = function(book) {
	for (var i = 0; i < this.books.length; ) {
		if (this.books[i].id == book.id) {
			this.books.splice(i, 1);
			this.updateWebService();
			return;
		} else {
			i++;
		}
	}
}
BooksRepository.prototype.updateWebService = function() {
	var booksRepository = this;
	this.booksService.postAllBooksToWebService(function(books) {
		booksRepository.books = books;
	}, booksRepository.books);
}
BooksRepository.prototype.addBookIfNew = function(book) {
	BooksRepository.setIdIfMissing(book);
	for(var i = 0; i < this.books.length; i++) {
		if (this.books[i].id == book.id) {
			this.books[i] = book;
			return;
		}
	}
	this.books.push(book);
}
BooksRepository.setIdIfMissing = function(book) {
	if (typeof book.id === "undefined" || !book.id) {
		book.id = BooksRepository.guid();
	}
}
BooksRepository.guid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}