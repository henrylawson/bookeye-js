describe("BooksService", function() {
	var booksService;
	var mockStatusWidget;
	var mockAjaxHandler;
	
	beforeEach(function() {
		mockAjaxHandler = jasmine.createSpy('ajax spy');
		mockStatusWidget = new StatusWidget();
	});
	
	describe("instantiation", function() {
		// check web service is called..
	});
	
	describe("getAll", function() {
		var newBook;
		
		beforeEach(function() {
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
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
		
		// check web service is called..
	});
	
	describe("getAllBooksFromWebService", function() {
		//  correct settings
	});
	
	describe("postAllBooksToWebService", function() {
		// correct settings
	});
	
	describe("updateHttpService", function() {
		var options;
		
		beforeEach(function() {
			options = {
				httpVerb: 'POST', 
				action: '/books',	
				data: { books: 'data' },
				async: true,
				messages: {
					started: 'Started!',
					completeSuccess: 'Success!',
					completeFailure: 'Error!',
				}
			};
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
		});
		
		it("should set standard message before sending", function() {
			spyOn(mockStatusWidget, "displayMessage");
			
			booksService.updateHttpService(options);
			
			expect(mockStatusWidget.displayMessage).toHaveBeenCalledWith('Started!');
		});
	
		it("should do a HTTP POST when sending", function() {
			spyOn(mockAjaxHandler, "mostRecentCall");
			
			booksService.updateHttpService(options);
		
			expect(mockAjaxHandler.mostRecentCall.args[0].type).toEqual("POST");
		});
	
		it("should have correct URL when sending", function() {
			spyOn(mockAjaxHandler, "mostRecentCall");
			
			booksService.updateHttpService(options);
		
			expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
		});
	
		it("should send the list of all books as data", function() {
			spyOn(mockAjaxHandler, "mostRecentCall");
			
			booksService.updateHttpService(options);
		
			expect(mockAjaxHandler.mostRecentCall.args[0].data).toEqual({ books: 'data' });
		});
	
		it("should set success message when sent successfully", function() {
			spyOn(mockStatusWidget, "displaySuccess");
			
			booksService.updateHttpService(options);
			mockAjaxHandler.mostRecentCall.args[0].complete(null, "success");
		
			expect(mockStatusWidget.displaySuccess).toHaveBeenCalledWith('Success!');
		});

		it("should set failure message when sending has failed", function() {
			spyOn(mockStatusWidget, "displayError");
			
			booksService.updateHttpService(options);
			mockAjaxHandler.mostRecentCall.args[0].complete(null, "error");

			expect(mockStatusWidget.displayError).toHaveBeenCalledWith('Error!');
		});
		
		describe("on success", function() {
			var returnedBooks;
			
			beforeEach(function() {
				returnedBooks = [BookFactory.createSerializedBook()];
				mockAjaxHandler.mostRecentCall.args[0].success(returnedBooks);
			});
			
			it("should replace old books with received books when successful", function() {
				expect(booksService.getAll()).toEqual(returnedBooks);
			});
			
			describe("should 'clean' the received serialized books", function() {
				it("by converting hasBeenRead to boolean", function() {
					expect(booksService.getAll()[0].hasBeenRead).toEqual(true);
				});

				it("by converting ownTheBook to boolean", function() {
					expect(booksService.getAll()[0].ownTheBook).toEqual(true);
				});

				it("by converting ownTheEBook to boolean", function() {
					expect(booksService.getAll()[0].ownTheEBook).toEqual(false);
				});
			});
		});
	});
});