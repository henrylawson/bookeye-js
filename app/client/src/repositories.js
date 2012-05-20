var BooksRepository = function(booksService) {
	this.booksService = booksService;
	this.books = [];
	var booksRepository = this;
	this.booksService.getAllBooksFromWebService(function(books) {
		booksRepository.books = books;
	});
}
BooksRepository.prototype.getAll = function(filter) {
	return this.filterAll(filter);
}
BooksRepository.prototype.filterAll = function(filter) {
	filter = filter || BookFilter.all;
	var filteredBooks = [];
	for(var i = 0; i < this.books.length; i++) {
		if (filter(this.books[i]) === true) {
			filteredBooks.push(this.books[i]);
		}
	}
	return filteredBooks;
}
BooksRepository.prototype.move = function(isUpMove, book, stateDetails) {
	
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