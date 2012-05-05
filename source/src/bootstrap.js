$(document).ready(function() {
	var booksController = new BooksController(new BooksView(), new BooksService());
	booksController.all();
});