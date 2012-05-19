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
		book.title = editHtml.find('input.title').val();
		book.author = editHtml.find('input.author').val();
		book.year = editHtml.find('input.year').val();
		book.cover = editHtml.find('input.cover').val();
		book.hasBeenRead = editHtml.find('input.has-been-read').prop('checked');
		book.ownTheBook = editHtml.find('input.own-the-book').prop('checked');
		book.ownTheEBook = editHtml.find('input.own-the-ebook').prop('checked');
		editHtml.modal('hide');
		options.callbacks.save(book);
	});
	editHtml.modal({
		keybaord: false,
		backdrop: 'static',
	});
	editHtml.find('.cancel').click(function() {
		editHtml.modal('hide');
		options.callbacks.cancel();
	});
	element.append(editHtml);
}