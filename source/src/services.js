var BooksService = function() {
	
}
BooksService.prototype.getAll = function() {
	return [
		{ id: 9, title: "Awesome book", author: "Henry" },
		{ id: 5, title: "Awesomer book", author: "Henry" },
	];
}
BooksService.prototype.save = function(book) {
	return book;
}