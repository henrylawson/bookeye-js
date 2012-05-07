var BooksView = function() {}
BooksView.prototype.all = function(displayElement, callback, books) {
	var element = $(displayElement).empty();
	var template = Handlebars.compile($('#books-view-all').html(), {noEscape: true});
	var view = this;
	$.each(books, function(i, book) {
		var bookHtml = $(template(book));
		bookHtml.click(function() {
			callback(book);
		});
		element.append(bookHtml);
	});
}
BooksView.prototype.form = function(displayElement, callback, book) {
	var element = $(displayElement).empty();
	var template = Handlebars.compile($('#books-view-form').html(), {noEscape: true});
	if (typeof book === "undefined") {
		var book = {};
	}
	var editHtml = $(template(book));
	editHtml.find('div.save').click(function() {
		book.title = $(this).parent().find('input.title').val();
		book.author = $(this).parent().find('input.author').val();
		book.year = $(this).parent().find('input.year').val();
		book.cover = $(this).parent().find('input.cover').val();
		book.hasBeenRead = $(this).parent().find('input.has-been-read').prop('checked');
		book.ownTheBook = $(this).parent().find('input.own-the-book').prop('checked');
		book.ownTheEBook = $(this).parent().find('input.own-the-ebook').prop('checked');
		callback(book);
	});
	element.append(editHtml);
}