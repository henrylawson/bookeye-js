describe("BooksView", function() {
	var booksView;
	var displayElement;
	
	beforeEach(function() {
		booksView = new BooksView();
		displayElement = $('<div></div>');
	});
	
	describe("all", function() {
		var options;

		beforeEach(function() {
			options = {
				displayElement: displayElement, 
				editCallback: jasmine.createSpy('edit callback'),
				deleteCallback: jasmine.createSpy('delete callback'),
				books: BookFactory.createBooks()
			};
		});
		
		it("should clear any data in display element before rendering", function() {
			displayElement.append("REMOVE ME");
			
			booksView.all(options);
				
			expect(displayElement.html()).not.toContain("REMOVE ME");
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
			displayElement.find('div.edit').first().click();
		
			expect(options.editCallback).toHaveBeenCalledWith(options.books[0]);
		});
		
		it("should execute delete callback with book when delete button is clicked", function() {
			booksView.all(options);
			displayElement.find('div.delete').first().click();

			expect(options.deleteCallback).toHaveBeenCalledWith(options.books[0]);
		});
	});
	
	describe("form", function() {
		var options;
		
		beforeEach(function() {
			options = {
				displayElement: displayElement,
				saveCallback: jasmine.createSpy("save callback"),
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
		
			expect(options.saveCallback).toHaveBeenCalledWith(options.book);
		});
		
		it("should execute callback when save is clicked", function() {
			booksView.form(options);
			displayElement.find('div.save').click();
		
			expect(options.saveCallback).toHaveBeenCalledWith(options.book);
		});

		describe("should pass book to callback when save is clicked", function() {
			var actualBook;
			var expectedBook;
			
			beforeEach(function() {
				options.saveCallback = function(book) {
					actualBook = book;
				};
				booksView.form(options);
			});

			it("with modified title", function() {
				var title = "New Title";
				displayElement.find('input.title').val(title);
				
				displayElement.find('div.save').click();
				
				expect(actualBook.title).toEqual(title);
			});
			
			it("with modified author", function() {
				var author = "New Author";
				displayElement.find('input.author').val(author);
				
				displayElement.find('div.save').click();
				
				expect(actualBook.author).toEqual(author);
			});
			
			it("with modified year", function() {
				var year = "2010";
				displayElement.find('input.year').val(year);
				
				displayElement.find('div.save').click();
				
				expect(actualBook.year).toEqual(year);
			});
			
			it("with modified cover", function() {
				var cover = "new_cover";
				displayElement.find('input.cover').val(cover);
				
				displayElement.find('div.save').click();
				
				expect(actualBook.cover).toEqual(cover);
			});
			
			it("with 'has been read' modified", function() {
				displayElement.find('input.has-been-read').prop('checked', false);
				
				displayElement.find('div.save').click();
				
				expect(actualBook.hasBeenRead).toBeFalsy();
			});
			
			it("with 'own the book' modified", function() {
				displayElement.find('input.own-the-book').prop('checked', false);
				
				displayElement.find('div.save').click();
				
				expect(actualBook.ownTheBook).toBeFalsy();
			});
			
			it("with 'own the ebook' modified", function() {
				displayElement.find('input.own-the-ebook').prop('checked', true);
				
				displayElement.find('div.save').click();
				
				expect(actualBook.ownTheEBook).toBeTruthy();
			});
		});
		
		it("should pass book to callback with values set when book is not provided", function() {
			var actualBook;
			options.saveCallback = function(book) {
				actualBook = book;
			}
			options.book = null;
			var newTitle = "New title";

			booksView.form(options);
			displayElement.find('input.title').val(newTitle);
			displayElement.find('div.save').click();

			expect(actualBook.title).toEqual(newTitle);
		});
	});
});