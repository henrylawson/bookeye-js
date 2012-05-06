describe("BooksService", function() {
	var booksService;
	var mockStatusWidget;
	var mockAjaxHandler;
	
	beforeEach(function() {
		mockAjaxHandler = jasmine.createSpy('ajax spy');
		mockStatusWidget = new StatusWidget();
		booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
	});
	
	describe("getAll", function() {
		it("should return array of books", function() {
			booksService.save({});
			booksService.save({});
			
			var books = booksService.getAll();
		
			expect(books.length).toEqual(2);
		});	
	});
	
	describe("save", function() {
		var newBook;
		
		beforeEach(function() {
			newBook = BookFactory.createBook();
			newBook.id = null;
		});
		
		it("should save a book and return it", function() {
			var returnedBook = booksService.save(newBook);
		
			expect(returnedBook.name).toEqual(newBook.name);
		});
		
		it("should save a book and it should be available in getAll", function() {
			booksService.save(newBook);
			
			expect(booksService.getAll()).toContain(newBook);
		});
		
		it("should not re-add a book that already exists in the serivce", function() {
			var originalBooksCount = booksService.getAll().length;
			
			booksService.save(booksService.save(newBook));
			
			expect(booksService.getAll().length).toEqual(originalBooksCount + 1);
			expect(booksService.getAll()).toContain(newBook);
		});
		
		it("should set standard message when book is sending to ajax service", function() {
			spyOn(mockStatusWidget, "displayMessage");
			
			booksService.save(newBook);
			
			expect(mockStatusWidget.displayMessage).toHaveBeenCalled();
		});
		
		it("should POST to url when sending book to ajax service", function() {
			booksService.save(newBook);
			
			expect(mockAjaxHandler.mostRecentCall.args[0].type).toEqual("POST");
		});
		
		it("should have /books URL when sending book to ajax service", function() {
			booksService.save(newBook);
			
			expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
		});
		
		it("should send the complte list of all books to ajax service", function() {
			booksService.save(newBook);
			
			expect(mockAjaxHandler.mostRecentCall.args[0].data).toEqual({ books: [newBook] });
		});
		
		it("should set success message when book is sent to ajax service", function() {
			spyOn(mockStatusWidget, "displaySuccess");
			
			booksService.save(newBook);
			mockAjaxHandler.mostRecentCall.args[0].complete(null, "success");
			
			expect(mockStatusWidget.displaySuccess).toHaveBeenCalled();
		});

		it("should set success message when book has failed to send to ajax service", function() {
			spyOn(mockStatusWidget, "displayError");

			booksService.save(newBook);
			mockAjaxHandler.mostRecentCall.args[0].complete(null, "error");

			expect(mockStatusWidget.displayError).toHaveBeenCalled();
		});
	});
});