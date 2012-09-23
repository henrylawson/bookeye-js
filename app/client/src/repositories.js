var BooksRepository = function(booksService, bookSorter, timeOut) {
	this.booksService = booksService;
	this.bookSorter = bookSorter;
	this.timeOut = timeOut;
	this.serviceCall = [];
	this.books = [];
	this.previousCallGuid = "";
	
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
	if (this.bookSorter.setPriortiesForCurrentOrder(filteredBooks)) {
		this.saveMultiple(filteredBooks);
	}
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
BooksRepository.prototype.move = function(bookToSwap, book, key) {
	if (typeof bookToSwap !== 'undefined') {
		var booksPriority = book.priority[key];
		var bookToSwapsPriority = bookToSwap.priority[key];
		book.priority[key] = bookToSwapsPriority;
		bookToSwap.priority[key] = booksPriority;
		this.addOrUpdate(book);
		this.addOrUpdate(bookToSwap);
		this.updateWebService();
	}
}
BooksRepository.prototype.saveMultiple = function(books) {
	for(var i = 0; i < books.length; i++) {
		this.addOrUpdate(books[i]);
	}
	this.updateWebService();
	return books;
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
	this.serviceCall[this.previousCallGuid] = false;
	var currentCallGuid = BooksRepository.guid();
	this.serviceCall[currentCallGuid] = true;
	var booksRepository = this;
	this.timeOut(function() {
		if (booksRepository.serviceCall[currentCallGuid] === true) {
			booksRepository.booksService.postAllBooksToWebService(function(books) {

			}, booksRepository.books);
		}
	}, 2000);
	this.previousCallGuid = currentCallGuid;
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