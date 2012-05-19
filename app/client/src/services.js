var BooksService = function(statusWidget, ajaxHandler) {
	this.ajaxHandler = ajaxHandler;
	this.statusWidget = statusWidget;
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
			var books = booksService.cleanSerializedBooks(receivedBooks);
			options.callbacks.success(books);
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
BooksService.prototype.getAllBooksFromWebService = function(successCallback) {
	this.updateHttpService({
		httpVerb: 'GET', 
		action: '/books',	
		async: false,
		messages: {
			started: 'Retrieving books...',
			completeSuccess: 'Books retrieved!',
			completeFailure: 'Error retrieving books from service',
		},
		callbacks: {
			success: successCallback
		}
	});
}
BooksService.prototype.postAllBooksToWebService = function(successCallback, books) {
	var booksRepository = this;
	this.updateHttpService({
		httpVerb: 'POST', 
		action: '/books',	
		data: books,
		async: true,
		messages: {
			started: 'Updating...',
			completeSuccess: 'Book saved!',
			completeFailure: 'Error saving book to service',
		},
		callbacks: {
			success: successCallback
		}
	});
}