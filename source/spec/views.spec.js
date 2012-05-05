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
			allTemplateElement = $("<div class=\"wrapper\"><div>{{title}} {{author}}</div></div>");
		});
		
		it("should clear any data in display element before rendering", function() {
			displayElement.append("REMOVE ME");
			
			booksView.all(allTemplateElement, displayElement, null, books);
				
			expect(displayElement.html()).not.toContain("REMOVE ME");
		});
	
		it("should render books in template", function() {
			booksView.all(allTemplateElement, displayElement, null, books);
		
			expect(displayElement.html()).toContain(books[0].title);
			expect(displayElement.html()).toContain(books[0].author);
			expect(displayElement.html()).toContain(books[1].title);
			expect(displayElement.html()).toContain(books[1].author);
		});
	
		it("should execute callback with book when a book is clicked", function() {
			var books = BookFactory.createBooks();
			var callback = jasmine.createSpy();
		
			booksView.all(allTemplateElement, displayElement, callback, books);
			displayElement.find('div').first().click();
		
			expect(callback).toHaveBeenCalledWith(books[0]);
		});
	});
	
	describe("form", function() {
		var formTempalteElement;
		var book;
		
		beforeEach(function() {
			book = BookFactory.createBook();
			formTempalteElement = $('<div class="wrapper"><div>' +
			'<input type="text" value="{{title}}" class="book-title" />' +
			'<input type="text" value="{{author}}" class="book-author" />' +
			'<div class="save">Save</div></div></div>');
		});
		
		it("should clear any data in display element before rendering", function() {
			displayElement.append("REMOVE ME");
			
			booksView.form(formTempalteElement, displayElement, null, book);
				
			expect(displayElement.html()).not.toContain("REMOVE ME");
		});
		
		it("should render book in template", function() {
			booksView.form(formTempalteElement, displayElement, null, book);
			
			expect(displayElement.html()).toContain(book.title);
			expect(displayElement.html()).toContain(book.author);
		});
		
		it("should execute callback when save is clicked", function() {
			var callback = jasmine.createSpy();
			
			booksView.form(formTempalteElement, displayElement, callback, book);
			displayElement.find('div.save').click();
		
			expect(callback).toHaveBeenCalledWith(book);
		});
		
		it("should execute callback when save is clicked", function() {
			var callback = jasmine.createSpy();
			
			booksView.form(formTempalteElement, displayElement, callback, book);
			displayElement.find('div.save').click();
		
			expect(callback).toHaveBeenCalledWith(book);
		});

		it("should pass book to callback with all form values set", function() {
			var callback = jasmine.createSpy();
			var expectedBook = { id: book.id, title: "New title", author: "New author" };

			booksView.form(formTempalteElement, displayElement, callback, book);
			displayElement.find('.book-title').val(expectedBook.title);
			displayElement.find('.book-author').val(expectedBook.author);
			displayElement.find('div.save').click();

			expect(callback).toHaveBeenCalledWith(expectedBook);
		});
	});
});