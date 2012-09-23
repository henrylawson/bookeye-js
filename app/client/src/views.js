var BooksView = function() {
	this.booksListing = $('#books-listing');
	this.booksListingWrapper = $('#books-listing-wrapper');
	this.tooltipSelector = '[rel=tooltip]';
	this.selected = {book: null, element: null};
}
BooksView.prototype.loading = function() {
	$("#loading").show();
}
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
			bookHtml.find('div, a, button').click(function(event) {
				event.stopPropagation();
			});
			bookHtml.find('.edit').click(function(event) {
				options.callbacks.edit(book);
			});
			bookHtml.find('.delete').click(function(event) {
				options.callbacks.delete(book);
			});
			bookHtml.find('.move-up').click(function(event) {
				options.callbacks.move(bookAbove, book);
			});
			bookHtml.find('.move-down').click(function() {
				options.callbacks.move(bookBelow, book);
			});
			bookHtml.click(function(event) {
				if (event.ctrlKey === true && view.selected.book != null && view.selected.book != book) {
					options.callbacks.move(view.selected.book, book);
				} else if (event.ctrlKey === false && view.selected.book == book) {
					view.selected.element.removeClass('selected');
					view.selected.book = null;
					view.selected.element = null;
				} else {
					view.selected.book = book;
					if (view.selected.element !== null) {
						view.selected.element.removeClass('selected');
					}
					view.selected.element = bookHtml;	
					view.selected.element.addClass('selected');		
				}
			});
			if (view.selected.book == book) {
				view.selected.element = bookHtml;	
				view.selected.element.addClass('selected');	
			}
			element.append(bookHtml);
		});
	} else {
		var template = Handlebars.compile($('#books-view-all-empty').html());
		element.append($(template()));
	}	
	this.booksListing.height(this.booksListingWrapper.height());
	$(this.tooltipSelector).tooltip();
	$("#loading").hide();
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
		book.notes = formHtml.find('textarea.notes').val();
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
LookupBooksView.prototype.quickAdd = function(options) {
	var element = $(options.displayElement).empty();
	var template = Handlebars.compile($('#look-books-view-form').html());
	var formHtml = $(template());
	var lookupBooksView = this;
	formHtml.find('input.query').keypress(function(e) {
		if ((e.keyCode || e.which) == 13) {
			formHtml.find('.search').click();
		}
	});
	formHtml.find('.search').button();
	formHtml.find('.search').click(function() {
		formHtml.find('.search').button('loading');
		var query = formHtml.find('input.query').val();
		options.callbacks.search(query);
		options.displayElement.find("#search-result").empty().append('<div class="loading"></div>');
	});
	formHtml.find('.add').addClass('disabled');
	formHtml.find('.cancel').click(function() {
		formHtml.modal('hide');
		options.callbacks.cancel();
	});
	formHtml.modal({
		keybaord: false,
		backdrop: 'static',
	});
	element.append(formHtml);
}
LookupBooksView.prototype.searchResult = function(options) {
	options.displayElement.find('.search').button('reset');
	var displayElement = options.displayElement.find("#search-result");
	var element = $(displayElement).empty();
	if (options.book === 'error') {
		var template = Handlebars.compile($('#look-books-view-search-result-error').html());
		var searchResultHtml = $(template());
		element.append(searchResultHtml);
	} else if (options.book === 'nothingFound') {
		var template = Handlebars.compile($('#look-books-view-search-result-nothingFound').html());
		var searchResultHtml = $(template());
		element.append(searchResultHtml);
	} else {
		var template = Handlebars.compile($('#look-books-view-search-result').html());
		var searchResultHtml = $(template(options.book));
		element.append(searchResultHtml);
		options.displayElement.find('.add').removeClass('disabled');
		options.displayElement.find('.add').addClass('enabled');
		options.displayElement.find('.add').unbind("click");
		options.displayElement.find('.add').click(function() {
			options.callbacks.add();
			options.displayElement.find('.cancel').click();
		});
	}
}