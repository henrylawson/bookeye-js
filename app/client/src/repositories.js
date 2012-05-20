var BooksRepository = function(booksService, bookSorter) {
	this.booksService = booksService;
	this.bookSorter = bookSorter;
	this.books = [];
	var booksRepository = this;
	this.booksService.getAllBooksFromWebService(function(books) {
		booksRepository.books = books;
	});
}
BooksRepository.prototype.getAll = function(options) {
	var key = this.determineKey(options);
	var filter = this.determineFilter(options);
	var filteredBooks = BookFilter.filterAllBy(this.books, filter);
	this.bookSorter.setKey(key);
	filteredBooks.sort(this.bookSorter.sort);
	this.bookSorter.setPriortiesForCurrentOrder(filteredBooks);
	for(var i = 0; i < filteredBooks.length; i++) {
		this.addOrUpdate(filteredBooks[i]);
	}
	this.updateWebService();
	return filteredBooks;
}
BooksRepository.prototype.determineKey = function(options) {
	var key = 'all';
	if (options) {
		key = options.key || 'all';
	}
	return key;
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
	this.addOrUpdate(book);
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
	}, this.books);
}
BooksRepository.prototype.addOrUpdate = function(book) {
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