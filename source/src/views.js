var BooksView = function() {
	
}
BooksView.prototype.all = function(templateElement, displayElement, callback, books) {
	var element = $(displayElement).empty();
	var template = Handlebars.compile($(templateElement).html());
	var view = this;
	$.each(books, function(i, book) {
		var bookHtml = $(template(book));
		bookHtml.click(function() {
			callback(book);
		});
		element.append(bookHtml);
	});
}
BooksView.prototype.form = function(templateElement, displayElement, callback, book) {
	var element = $(displayElement).empty();
	var template = Handlebars.compile($(templateElement).html());
	var editHtml = $(template(book));
	editHtml.find('div.save').click(function() {
		book.title = $(this).parent().find('.book-title').val();
		book.author = $(this).parent().find('.book-author').val();
		callback(book);
	});
	element.append(editHtml);
}