var BookSorter = function() {
}
BookSorter.prototype.setKey = function(key) {
	BookSorter._key = key;
}
BookSorter.prototype.sort = function(first, second) {
	var firstPriority = BookSorter.determinePriority(first);
	var secondPriority = BookSorter.determinePriority(second);
	if (firstPriority == secondPriority) {
		return 0;
	} else if (firstPriority > secondPriority) {
  	return -1;
	} else {
  	return 1;
	}
}
BookSorter.prototype.setPriortiesForCurrentOrder = function(books) {
	var priority = books.length;
	for(var i = 0; i < books.length; i++) {
		books[i].priority = [];
		books[i].priority[BookSorter._key] = priority;
		priority--;
	}
}
BookSorter.determinePriority = function(book) {
	if (typeof book.priority === 'undefined' || book.priority == null) {
		return -1;
	} else if (typeof book.priority[BookSorter._key] === 'undefined') {
		return -1;
	} else {
		return book.priority[BookSorter._key];
	}
}