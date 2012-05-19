var BooksRepository = function(booksService) {
	this.booksService = booksService;
	this.books = [];
	var booksRepository = this;
	this.booksService.getAllBooksFromWebService(function(books) {
		booksRepository.books = books;
	});
}
BooksRepository.prototype.getAll = function() {
	return this.books;
}
BooksRepository.prototype.save = function(book) {
	this.addBookIfNew(book);
	var booksRepository = this;
	this.booksService.postAllBooksToWebService(function(books) {
		booksRepository.books = books;
	}, this.books);
	return book;
}
BooksRepository.prototype.addBookIfNew = function(book) {
	if (typeof book.id === "undefined" || !book.id) {
		book.id = BooksRepository.guid();
		this.books.push(book);
	}
}
BooksRepository.guid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}