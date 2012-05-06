var BooksService = function(statusWidget, ajaxHandler) {
	this.statusWidget = statusWidget;
	this.ajaxHandler = ajaxHandler;
	this.books = [];
}
BooksService.guid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
BooksService.prototype.getAll = function() {
	return this.books;
}
BooksService.prototype.save = function(book) {
	var booksService = this;
	if (typeof book.id === "undefined" || !book.id) {
		book.id = BooksService.guid();
		this.books.push(book);
	}
	this.statusWidget.displayMessage("Saving book...");
	this.ajaxHandler({
		type: 'POST',
		url: '/books',
		data: { books: this.books },
		complete: function(jqXHR, textStatus) {
			if (textStatus == "success") {
				booksService.statusWidget.displaySuccess("Book saved!");
			} else if (textStatus == "error") {
				booksService.statusWidget.displayError("Error saving book to service");
			}
		}
	});
	return book;
}