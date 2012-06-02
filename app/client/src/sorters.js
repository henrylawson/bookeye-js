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
	var updated = false;
	var priority = books.length;
	for(var i = 0; i < books.length; i++) {
		if (typeof books[i].priority === 'undefined') {
			books[i].priority = {};
		}
		if (books[i].priority[BookSorter._key] != priority) {
			books[i].priority[BookSorter._key] = priority;
			updated = true;
		}
		priority--;
	}
	return updated;
}
BookSorter.determinePriority = function(book) {
	if (typeof book.priority === 'undefined' || book.priority == null) {
		return -1;
	} else if (typeof book.priority[BookSorter._key] === 'undefined') {
		return -1;
	} else {
		return parseInt(book.priority[BookSorter._key]);
	}
}