var BooksService = function() {
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
	if (typeof book.id === "undefined" || !book.id) {
		book.id = BooksService.guid();
		this.books.push(book);
	}
	return book;
}