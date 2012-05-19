var BooksView = function() {}
BooksView.prototype.all = function(options) {
	var element = $(options.displayElement).empty();
	if (options.books.length > 0) {
		var template = Handlebars.compile($('#books-view-all').html());
		var view = this;
		$.each(options.books, function(i, book) {
			var bookHtml = $(template(book));
			bookHtml.find('div.edit').click(function() {
				options.callbacks.edit(book);
			});
			bookHtml.find('div.delete').click(function() {
				options.callbacks.delete(book);
			});
			element.append(bookHtml);
		});
	} else {
		var template = Handlebars.compile($('#books-view-all-empty').html());
		element.append($(template()));
	}
}
BooksView.prototype.form = function(options) {
	var book = options.book || {};
	var element = $(options.displayElement).empty();
	var template = Handlebars.compile($('#books-view-form').html());
	var editHtml = $(template(book));
	editHtml.find('input.cover').val(book.cover);
	editHtml.find('div.save').click(function() {
		book.title = $(this).parent().find('input.title').val();
		book.author = $(this).parent().find('input.author').val();
		book.year = $(this).parent().find('input.year').val();
		book.cover = $(this).parent().find('input.cover').val();
		book.hasBeenRead = $(this).parent().find('input.has-been-read').prop('checked');
		book.ownTheBook = $(this).parent().find('input.own-the-book').prop('checked');
		book.ownTheEBook = $(this).parent().find('input.own-the-ebook').prop('checked');
		options.callbacks.save(book);
	});
	element.append(editHtml);
}