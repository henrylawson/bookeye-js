var BooksView = function() {}
BooksView.prototype.all = function(options) {
	var element = $(options.displayElement).empty();
	if (options.books.length > 0) {
		var template = Handlebars.compile($('#books-view-all').html());
		var view = this;
		$.each(options.books, function(i, book) {
			var bookHtml = $(template(book));
			var bookAbove = options.books[i-1];
			var bookBelow = options.books[i+1];
			if (typeof bookAbove === 'undefined') {
				bookHtml.find('.move-up').hide();
			}
			if (typeof bookBelow === 'undefined') {
				bookHtml.find('.move-down').hide();
			}
			bookHtml.find('.edit').click(function() {
				options.callbacks.edit(book);
			});
			bookHtml.find('.delete').click(function() {
				options.callbacks.delete(book);
			});
			bookHtml.find('.move-up').click(function() {
				options.callbacks.move(bookAbove, book);
			});
			bookHtml.find('.move-down').click(function() {
				options.callbacks.move(bookBelow, book);
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
	var formHtml = $(template(book));
	formHtml.find('input.cover').val(book.cover);
	formHtml.find('.save').click(function() {
		book.title = formHtml.find('input.title').val();
		book.author = formHtml.find('input.author').val();
		book.year = formHtml.find('input.year').val();
		book.cover = formHtml.find('input.cover').val();
		book.hasBeenRead = formHtml.find('input.has-been-read').prop('checked');
		book.ownTheBook = formHtml.find('input.own-the-book').prop('checked');
		book.ownTheEBook = formHtml.find('input.own-the-ebook').prop('checked');
		formHtml.modal('hide');
		options.callbacks.save(book);
	});
	formHtml.modal({
		keybaord: false,
		backdrop: 'static',
	});
	formHtml.find('.cancel').click(function() {
		formHtml.modal('hide');
		options.callbacks.cancel();
	});
	element.append(formHtml);
}
BooksView.prototype.deleteConfirm = function(options) {
	var book = options.book || {};
	var element = $(options.displayElement).empty();
	var template = Handlebars.compile($('#books-view-delete-confirm').html());
	var deleteConfirmHtml = $(template(book));
	deleteConfirmHtml.find('.delete').click(function() {
		deleteConfirmHtml.alert('close');
		options.callbacks.delete(book);
	});
	deleteConfirmHtml.find('.cancel').click(function() {
		deleteConfirmHtml.alert('close');
		options.callbacks.cancel();
	});
	element.append(deleteConfirmHtml);
	deleteConfirmHtml.alert();
}

var LookupBooksView = function() {}
LookupBooksView.prototype.form = function(options) {
	var element = $(options.displayElement).empty();
	var template = Handlebars.compile($('#look-books-view-form').html());
	var formHtml = $(template());
	var lookupBooksView = this;
	formHtml.find('.search').click(function() {
		var query = formHtml.find('input.query').val();
		options.callbacks.search(query);
	});
	formHtml.modal({
		keybaord: false,
		backdrop: 'static',
	});
	element.append(formHtml);
}