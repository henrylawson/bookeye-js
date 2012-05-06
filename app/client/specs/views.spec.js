describe("BooksView", function() {
	var booksView;
	var displayElement;
	
	beforeEach(function() {
		booksView = new BooksView();
		displayElement = $('<div></div>');
	});
	
	describe("all", function() {
		var allTemplateElement;
		var books;

		beforeEach(function() {
			books = BookFactory.createBooks();
		});
		
		it("should clear any data in display element before rendering", function() {
			displayElement.append("REMOVE ME");
			
			booksView.all(displayElement, null, books);
				
			expect(displayElement.html()).not.toContain("REMOVE ME");
		});
		
		describe("should render single book in template", function() {
			var book;
			
			beforeEach(function() {
				book = BookFactory.createBook(); 
				book.hasBeenRead = true;
				book.ownTheBook = false;
				book.ownTheEBook = true;
				booksView.all(displayElement, null, [book]);
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
			expect(books[0].title).not.toEqual(books[1].title);
			
			booksView.all(displayElement, null, books);
		
			expect(displayElement.html()).toContain(books[0].title);
			expect(displayElement.html()).toContain(books[1].title);
		});
	
		it("should execute callback with book when a book is clicked", function() {
			var books = BookFactory.createBooks();
			var callback = jasmine.createSpy();
		
			booksView.all(displayElement, callback, books);
			displayElement.find('div').first().click();
		
			expect(callback).toHaveBeenCalledWith(books[0]);
		});
	});
	
	describe("form", function() {
		var formTempalteElement;
		var book;
		
		beforeEach(function() {
			book = BookFactory.createBook();
		});
		
		it("should clear any data in display element before rendering", function() {
			displayElement.append("REMOVE ME");
			
			booksView.form(displayElement, null, book);
				
			expect(displayElement.html()).not.toContain("REMOVE ME");
		});
		
		describe("should render book in form template", function() {
			var book;
			
			beforeEach(function() {
				book = BookFactory.createBook(); 
				book.hasBeenRead = true;
				book.ownTheBook = true;
				book.ownTheEBook = false;
				booksView.form(displayElement, null, book);
			});
		
			it("with title", function() {
				expect(displayElement.html()).toContain(book.title);
			});
			
			it("with author", function() {
				expect(displayElement.html()).toContain(book.title);
			});
			
			it("with year", function() {
				expect(displayElement.html()).toContain(book.title);
			});
			
			it("with cover image", function() {
				expect(displayElement.html()).toContain(book.title);
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
			booksView.form(displayElement, null);
			
			expect(displayElement).toContain('div.save');
		});
		
		it("should execute callback when save is clicked", function() {
			var saveClickedCallback = jasmine.createSpy("save clicked callback");
			
			booksView.form(displayElement, saveClickedCallback, book);
			displayElement.find('div.save').click();
		
			expect(saveClickedCallback).toHaveBeenCalledWith(book);
		});
		
		it("should execute callback when save is clicked", function() {
			var saveClickedCallback = jasmine.createSpy("save clicked callback");
			
			booksView.form(displayElement, saveClickedCallback, book);
			displayElement.find('div.save').click();
		
			expect(saveClickedCallback).toHaveBeenCalledWith(book);
		});

		describe("should pass book to callback when save is clicked", function() {
			var actualBook;
			var expectedBook;
			
			beforeEach(function() {
				var saveClickedCallback = function(book) {
					actualBook = book;
				};
				booksView.form(displayElement, saveClickedCallback, book);
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
			var saveClickedCallback = function(book) {
				actualBook = book;
			}
			var newTitle = "New title";

			booksView.form(displayElement, saveClickedCallback);
			displayElement.find('input.title').val(newTitle);
			displayElement.find('div.save').click();

			expect(actualBook.title).toEqual(newTitle);
		});
	});
});