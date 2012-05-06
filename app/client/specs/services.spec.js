describe("BooksService", function() {
	var booksService;
	var mockStatusWidget;
	var mockAjaxHandler;
	
	beforeEach(function() {
		mockAjaxHandler = jasmine.createSpy('ajax spy');
		mockStatusWidget = new StatusWidget();
	});
	
	describe("instantiation", function() {
		describe("getting books from web service", function() {
			it("should set standard message before retrieving", function() {
				spyOn(mockStatusWidget, "displayMessage");
		
				booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
		
				expect(mockStatusWidget.displayMessage).toHaveBeenCalled();
			});
	
			it("should do a HTTP GET when retrieving", function() {
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
		
				expect(mockAjaxHandler.mostRecentCall.args[0].type).toEqual("GET");
			});
	
			it("should have correct URL when retrieving", function() {
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
		
				expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
			});
			
			it("should do a synchronous call when retrieving", function() {
				booksService = new BooksService(mockStatusWidget, mockAjaxHandler);

				expect(mockAjaxHandler.mostRecentCall.args[0].async).toBeDefined();
				expect(mockAjaxHandler.mostRecentCall.args[0].async).toBeFalsy();
			});
	
			it("should set success message when retrieved successfully", function() {
				spyOn(mockStatusWidget, "displaySuccess");
		
				booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
				mockAjaxHandler.mostRecentCall.args[0].complete(null, "success");
		
				expect(mockStatusWidget.displaySuccess).toHaveBeenCalled();
			});

			it("should set failure message when retrieval has failed", function() {
				spyOn(mockStatusWidget, "displayError");

				booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
				mockAjaxHandler.mostRecentCall.args[0].complete(null, "error");

				expect(mockStatusWidget.displayError).toHaveBeenCalled();
			});

			it("should replace old books with received books when successful", function() {
				var returnedBooks = [BookFactory.createBook()];
				booksService = new BooksService(mockStatusWidget, mockAjaxHandler);

				mockAjaxHandler.mostRecentCall.args[0].success(returnedBooks);

				expect(booksService.getAll()).toEqual(returnedBooks);
			});
		});
	});
	
	describe("getAll", function() {
		var newBook;
		
		beforeEach(function() {
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
			newBook = BookFactory.createBook();
			newBook.id = null;
		});
		
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
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
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
		
		it("should not re-add a book that already exists", function() {
			var originalBooksCount = booksService.getAll().length;
			
			booksService.save(booksService.save(newBook));
			
			expect(booksService.getAll().length).toEqual(originalBooksCount + 1);
			expect(booksService.getAll()).toContain(newBook);
		});
		
		describe("to web service", function() {
			it("should set standard message before sending", function() {
				spyOn(mockStatusWidget, "displayMessage");
			
				booksService.save(newBook);
			
				expect(mockStatusWidget.displayMessage).toHaveBeenCalled();
			});
		
			it("should do a HTTP POST when sending", function() {
				booksService.save(newBook);
			
				expect(mockAjaxHandler.mostRecentCall.args[0].type).toEqual("POST");
			});
		
			it("should have correct URL when sending", function() {
				booksService.save(newBook);
			
				expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
			});
		
			it("should send the list of all books as data", function() {
				booksService.save(newBook);
			
				expect(mockAjaxHandler.mostRecentCall.args[0].data).toEqual({ books: [newBook] });
			});
		
			it("should set success message when sent successfully", function() {
				spyOn(mockStatusWidget, "displaySuccess");
			
				booksService.save(newBook);
				mockAjaxHandler.mostRecentCall.args[0].complete(null, "success");
			
				expect(mockStatusWidget.displaySuccess).toHaveBeenCalled();
			});

			it("should set failure message when sending has failed", function() {
				spyOn(mockStatusWidget, "displayError");

				booksService.save(newBook);
				mockAjaxHandler.mostRecentCall.args[0].complete(null, "error");

				expect(mockStatusWidget.displayError).toHaveBeenCalled();
			});
			
			it("should replace old books with received books when successful", function() {
				var returnedBooks = [newBook];
				booksService.save(newBook);
				
				mockAjaxHandler.mostRecentCall.args[0].success(returnedBooks);
				
				expect(booksService.getAll()).toEqual(returnedBooks);
			});
		});
	});
});