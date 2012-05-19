var BooksService = function(statusWidget, ajaxHandler) {
	this.statusWidget = statusWidget;
	this.ajaxHandler = ajaxHandler;
	this.books = [];
	this.getAllBooksFromWebService();
}
BooksService.prototype.getAll = function() {
	return this.books;
}
BooksService.prototype.save = function(book) {
	this.addBookIfNew(book);
	this.postAllBooksToWebService();
	return book;
}
BooksService.prototype.addBookIfNew = function(book) {
	if (typeof book.id === "undefined" || !book.id) {
		book.id = BooksService.guid();
		this.books.push(book);
	}
}
BooksService.prototype.getAllBooksFromWebService = function() {
	this.updateHttpService({
		httpVerb: 'GET', 
		action: '/books',	
		async: false,
		messages: {
			started: 'Retrieving books...',
			completeSuccess: 'Books retrieved!',
			completeFailure: 'Error retrieving books from service',
		}
	});
}
BooksService.prototype.postAllBooksToWebService = function() {
	this.updateHttpService({
		httpVerb: 'POST', 
		action: '/books',	
		data: { books: this.books },
		async: true,
		messages: {
			started: 'Updating...',
			completeSuccess: 'Book saved!',
			completeFailure: 'Error saving book to service',
		}
	});
}
BooksService.prototype.updateHttpService = function(options) {
	var booksService = this;
	this.statusWidget.displayMessage(options.messages.started);
	this.ajaxHandler({
		type: options.httpVerb,
		url: options.action,
		data: options.data,
		async: options.async,
		success: function(receivedBooks) {
			booksService.books = booksService.cleanSerializedBooks(receivedBooks);
		},
		complete: function(jqXHR, textStatus) {
			if (textStatus == "success") {
				booksService.statusWidget.displaySuccess(options.messages.completeSuccess);
			} else if (textStatus == "error") {
				booksService.statusWidget.displayError(options.messages.completeFailure);
			}
		}
	});
}
BooksService.guid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
BooksService.prototype.cleanSerializedBooks = function(books) {
	for(var i = 0; i < books.length; i++) {
		books[i].hasBeenRead = this.cleanBoolean(books[i].hasBeenRead);
		books[i].ownTheBook = this.cleanBoolean(books[i].ownTheBook);
		books[i].ownTheEBook = this.cleanBoolean(books[i].ownTheEBook);
	}
	return books;
}
BooksService.prototype.cleanBoolean = function(bookBooleanProperty) {
	return (bookBooleanProperty == 'true');
}