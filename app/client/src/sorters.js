var BookSorter = function(key) {
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
BookSorter.determinePriority = function(book) {
	if (typeof book.priority === 'undefined' || book.priority == null) {
		return -1;
	} else if (typeof book.priority[BookSorter._key] === 'undefined') {
		return -1;
	} else {
		return book.priority[BookSorter._key];
	}
}