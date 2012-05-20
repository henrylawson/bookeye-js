var BookFilter = {};
BookFilter.all = function(book) {
	return true;
}
BookFilter.upcoming = function(book) {
	return book.hasBeenRead === false;
}
BookFilter.wishlist = function(book) {
	return book.hasBeenRead === false
					&& book.ownTheEBook === false
					&& book.ownTheBook === false;
}
BookFilter.read = function(book) {
	return book.hasBeenRead === true;
}