describe("BooksView", function() {
	var booksView;
	var displayElement;
	
	beforeEach(function() {
		booksView = new BooksView();
		displayElement = $('<table></table>');
	});
	
	describe("all", function() {
		var options;

		beforeEach(function() {
			options = {
				displayElement: displayElement, 
				callbacks: {
					edit: jasmine.createSpy('edit callback'),
					delete: jasmine.createSpy('delete callback'),
					move: jasmine.createSpy('move callback'),
				},
				books: BookFactory.createBooks()
			};
		});
		
		it("should clear any data in display element before rendering", function() {
			displayElement.append("REMOVE ME");
			
			booksView.all(options);
				
			expect(displayElement.html()).not.toContain("REMOVE ME");
		});
		
		it("should show empty message when no books to display", function() {
			options.books = [];
			
			booksView.all(options);
				
			expect(displayElement.html()).toContain("No books");
		});
		
		describe("should render single book in template", function() {
			var book;
			
			beforeEach(function() {
				book = BookFactory.createBook(); 
				book.hasBeenRead = true;
				book.ownTheBook = false;
				book.ownTheEBook = true;
				options.books = [book];
				booksView.all(options);
			});
		
			it("with title", function() {
				expect(displayElement.html()).toContain(book.title);
			});
			
			it("with author", function() {
				expect(displayElement.html()).toContain(book.author);
			});
			
			it("with year", function() {
				expect(displayElement.html()).toContain(book.year);
			});
			
			it("with cover image", function() {
				expect(displayElement.find('img.cover').attr('src')).toEqual(book.cover);
			});
			
			it("with has been read checked", function() {
				expect(displayElement.find('.has-been-read')).toHaveClass('checked');
			});
			
			it("with own the ebook unchecked", function() {
				expect(displayElement.find('.own-the-book')).not.toHaveClass('checked');
			});
			
			it("with has been read checked", function() {
				expect(displayElement.find('.own-the-ebook')).toHaveClass('checked');
			});
		});
	
		it("should render multiple books in template", function() {
			expect(options.books[0].title).not.toEqual(options.books[1].title);
			
			booksView.all(options);
		
			expect(displayElement.html()).toContain(options.books[0].title);
			expect(displayElement.html()).toContain(options.books[1].title);
		});
	
		it("should execute edit callback with book when edit button is clicked", function() {
			booksView.all(options);
			displayElement.find('.edit').first().click();
		
			expect(options.callbacks.edit).toHaveBeenCalledWith(options.books[0]);
		});
		
		it("should execute delete callback with book when delete button is clicked", function() {
			booksView.all(options);
			displayElement.find('.delete').first().click();

			expect(options.callbacks.delete).toHaveBeenCalledWith(options.books[0]);
		});
		
		it("should execute move callback with book when move-up button is clicked", function() {
			booksView.all(options);
			displayElement.find('.move-up').first().click();

			expect(options.callbacks.move).toHaveBeenCalledWith(undefined, options.books[0]);
		});
		
		it("should execute move callback with book when move-down button is clicked", function() {
			booksView.all(options);
			displayElement.find('.move-down').first().click();

			expect(options.callbacks.move).toHaveBeenCalledWith(options.books[1], options.books[0]);
		});
	});
	
	describe("form", function() {
		var options;
		
		beforeEach(function() {
			options = {
				displayElement: displayElement,
				callbacks: {
					save: jasmine.createSpy("save callback"),
					cancel: jasmine.createSpy("cancel callback")
				},
				book: BookFactory.createBook()
			}
		});
		
		it("should clear any data in display element before rendering", function() {
			displayElement.append("REMOVE ME");
			
			booksView.form(options);
				
			expect(displayElement.html()).not.toContain("REMOVE ME");
		});
		
		describe("should render book in form template", function() {
			var book;
			
			beforeEach(function() {
				book = BookFactory.createBook(); 
				book.hasBeenRead = true;
				book.ownTheBook = true;
				book.ownTheEBook = false;
				options.book = book;
				booksView.form(options);
			});
		
			it("with title", function() {
				expect(displayElement.html()).toContain(book.title);
			});
			
			it("with author", function() {
				expect(displayElement.html()).toContain(book.author);
			});
			
			it("with year", function() {
				expect(displayElement.html()).toContain(book.year);
			});
			
			it("with cover image", function() {
				expect(displayElement.find('.cover').val()).toEqual(book.cover);
			});
			
			it("with has been read checked", function() {
				expect(displayElement.find('.has-been-read').prop('checked')).toEqual(book.hasBeenRead);
			});
			
			it("with own the ebook unchecked", function() {
				expect(displayElement.find('.own-the-book').prop('checked')).toEqual(book.ownTheBook);
			});
			
			it("with has been read checked", function() {
				expect(displayElement.find('.own-the-ebook').prop('checked')).toEqual(book.ownTheEBook);
			});
		});
		
		it("should render template when no book provided", function() {
			booksView.form(options);
			
			expect(displayElement).toContain('div.save');
		});
		
		it("should execute callback when save is clicked", function() {
			booksView.form(options);
			displayElement.find('div.save').click();
		
			expect(options.callbacks.save).toHaveBeenCalledWith(options.book);
		});
		
		it("should execute callback when cancel is clicked", function() {
			booksView.form(options);
			displayElement.find('div.cancel').click();
		
			expect(options.callbacks.cancel).toHaveBeenCalledWith();
		});

		describe("should pass book to callback when save is clicked", function() {
			var actualBook;
			
			beforeEach(function() {
				booksView.form(options);
				mostRecentSaveCall = options.callbacks.save.mostRecentCall;
			});

			it("with modified title", function() {
				var title = "New Title";
				displayElement.find('input.title').val(title);
				
				displayElement.find('div.save').click();
				
				expect(mostRecentSaveCall.args[0].title).toEqual(title);
			});
			
			it("with modified author", function() {
				var author = "New Author";
				displayElement.find('input.author').val(author);
				
				displayElement.find('div.save').click();
				
				expect(mostRecentSaveCall.args[0].author).toEqual(author);
			});
			
			it("with modified year", function() {
				var year = "2010";
				displayElement.find('input.year').val(year);
				
				displayElement.find('div.save').click();
				
				expect(mostRecentSaveCall.args[0].year).toEqual(year);
			});
			
			it("with modified cover", function() {
				var cover = "new_cover";
				displayElement.find('input.cover').val(cover);
				
				displayElement.find('div.save').click();
				
				expect(mostRecentSaveCall.args[0].cover).toEqual(cover);
			});
			
			it("with 'has been read' modified", function() {
				displayElement.find('input.has-been-read').prop('checked', false);
				
				displayElement.find('div.save').click();
				
				expect(mostRecentSaveCall.args[0].hasBeenRead).toBeFalsy();
			});
			
			it("with 'own the book' modified", function() {
				displayElement.find('input.own-the-book').prop('checked', false);
				
				displayElement.find('div.save').click();
				
				expect(mostRecentSaveCall.args[0].ownTheBook).toBeFalsy();
			});
			
			it("with 'own the ebook' modified", function() {
				displayElement.find('input.own-the-ebook').prop('checked', true);
				
				displayElement.find('div.save').click();
				
				expect(mostRecentSaveCall.args[0].ownTheEBook).toBeTruthy();
			});
		});
		
		it("should pass book to callback with values set when book is not provided", function() {
			options.book = null;
			var newTitle = "New title";

			booksView.form(options);
			displayElement.find('input.title').val(newTitle);
			displayElement.find('div.save').click();

			expect(options.callbacks.save.mostRecentCall.args[0].title).toEqual(newTitle);
		});
	});
	
	describe("delete-confirm", function() {
		var options;
		
		beforeEach(function() {
			options = {
				displayElement: $("<div></div>"),
				callbacks: {
					delete: jasmine.createSpy("delete callback"),
					cancel: jasmine.createSpy("cancel callback")
				},
				book: BookFactory.createBook(),
			};
		});
		
		it("should clear any data in display element before rendering", function() {
			options.displayElement.append("REMOVE ME");
			
			booksView.deleteConfirm(options);
				
			expect(options.displayElement.html()).not.toContain("REMOVE ME");
		});
		
		it("should render the book title in the display element", function() {
			booksView.deleteConfirm(options);
			
			expect(options.displayElement.html()).toContain(options.book.title);
		});
		
		it("should execute delete callback on delete button click", function() {
			booksView.deleteConfirm(options);
			
			options.displayElement.find('.delete').click();
			
			expect(options.callbacks.delete).toHaveBeenCalledWith(options.book);
		});
		
		
		it("should execute cancel callback on cancel button click", function() {
			booksView.deleteConfirm(options);
			
			options.displayElement.find('.cancel').click();
			
			expect(options.callbacks.cancel).toHaveBeenCalled();
		});
	});
});