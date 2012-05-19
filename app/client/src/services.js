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
	this.statusWidget.displayMessage("Saving book...");
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
	this.statusWidget.displayMessage("Retrieving books...");
	var booksService = this;
	this.ajaxHandler({
		type: 'GET',
		url: '/books',
		async: false,
		success: function(newBooks) {
			booksService.books = booksService.cleanSerializedBooks(newBooks);
		},
		complete: function(jqXHR, textStatus) {
			if (textStatus == "success") {
				booksService.statusWidget.displaySuccess("Books retrieved!");
			} else if (textStatus == "error") {
				booksService.statusWidget.displayError("Error retrieving books from service");
				booksService.books = [];
			}
		}
	});
}
BooksService.prototype.postAllBooksToWebService = function() {
	var booksService = this;
	this.ajaxHandler({
		type: 'POST',
		url: '/books',
		data: { books: this.books },
		success: function(newBooks) {
			booksService.books = booksService.cleanSerializedBooks(newBooks);
		},
		complete: function(jqXHR, textStatus) {
			if (textStatus == "success") {
				booksService.statusWidget.displaySuccess("Book saved!");
			} else if (textStatus == "error") {
				booksService.statusWidget.displayError("Error saving book to service");
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