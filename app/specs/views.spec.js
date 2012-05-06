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
	
		it("should render books in template", function() {
			booksView.all(displayElement, null, books);
		
			expect(displayElement.html()).toContain(books[0].title);
			expect(displayElement.html()).toContain(books[0].author);
			expect(displayElement.html()).toContain(books[1].title);
			expect(displayElement.html()).toContain(books[1].author);
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
		
		it("should render book in template", function() {
			booksView.form(displayElement, null, book);
			
			expect(displayElement.html()).toContain(book.title);
			expect(displayElement.html()).toContain(book.author);
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

		it("should pass book to callback with all form values set", function() {
			var saveClickedCallback = jasmine.createSpy("save clicked callback");
			var expectedBook = { id: book.id, title: "New title", author: "New author" };

			booksView.form(displayElement, saveClickedCallback, book);
			displayElement.find('.book-title').val(expectedBook.title);
			displayElement.find('.book-author').val(expectedBook.author);
			displayElement.find('div.save').click();

			expect(saveClickedCallback).toHaveBeenCalledWith(expectedBook);
		});
		
		it("should pass book to callback with all values set when book not provided", function() {
			var saveClickedCallback = jasmine.createSpy("save clicked callback");
			var expectedBook = { title: "New title", author: "New author" };

			booksView.form(displayElement, saveClickedCallback);
			displayElement.find('.book-title').val(expectedBook.title);
			displayElement.find('.book-author').val(expectedBook.author);
			displayElement.find('div.save').click();

			expect(saveClickedCallback).toHaveBeenCalledWith(expectedBook);
		});
	});
});