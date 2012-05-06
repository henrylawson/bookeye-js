$(document).ready(function() {
	var booksController = new BooksController($('#content'), new BooksView(), new BooksService());
	booksController.all();
	var navigationWidget = new Navigation($('#navigation ul.items'));
	
});