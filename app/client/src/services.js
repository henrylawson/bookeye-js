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
				booksService.statusWidget.displaySuccess(options.messages.success);
			} else if (textStatus == "error") {
				booksService.statusWidget.displayError(options.messages.error);
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
			success: 'Books retrieved!',
			error: 'Error retrieving books from the service',
		},
		callbacks: {
			success: successCallback
		}
	});
}
BooksService.prototype.postAllBooksToWebService = function(successCallback, allBooks) {
	var booksRepository = this;
	this.updateHttpService({
		httpVerb: 'POST', 
		action: '/books',	
		data: { books: allBooks },
		async: true,
		messages: {
			started: 'Updating...',
			success: 'Books updated!',
			error: 'Error updating books to the service',
		},
		callbacks: {
			success: successCallback
		}
	});
}

var GoogleBooksService = function(statusWidget, ajaxHandler) {
	this.statusWidget = statusWidget;
	this.ajaxHandler = ajaxHandler;
}
GoogleBooksService.prototype.search = function(options) {
	var googleBooksService = this;
	this.ajaxHandler({
		type: 'GET',
		url: 'https://www.googleapis.com/books/v1/volumes',
		data: {
			q: options.searchTerm
		},
		dataType: 'jsonp',
		success: function(results) {
			options.callbacks.success(results)
		},
		complete: function(jqXHR, textStatus) {
			if (textStatus == "success") {
				googleBooksService.statusWidget.displaySuccess(options.messages.success);
			} else if (textStatus == "error") {
				googleBooksService.statusWidget.displayError(options.messages.error);
			}
		}
	});
}