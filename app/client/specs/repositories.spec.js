describe("BooksRepository", function() {
	var booksRepository;
	var mockStatusWidget;
	var mockAjaxHandler;
	
	beforeEach(function() {
		mockStatusWidget = new StatusWidget($('<div></div>'));
		mockBooksService = new BooksService(mockStatusWidget, jasmine.createSpy('ajax service'));
		booksRepository = new BooksRepository(mockBooksService);
	});
	
	describe("instantiation", function() {
		it("should have no books if web service call doesn't return", function() {
			var books = booksRepository.getAll();
	
			expect(books.length).toEqual(0);
		});
		
		describe("should get books from the web service", function() {
			var mostRecentCallArguments;
			
			beforeEach(function() {
				mockBooksService.getAllBooksFromWebService = jasmine.createSpy("get from web service");
				booksRepository = new BooksRepository(mockBooksService);
				mostRecentCallArguments = mockBooksService.getAllBooksFromWebService.mostRecentCall.args; 
			});
			
			it("and on success, update the repository", function() {
				var serviceReturnedBooks = BookFactory.createBooks();
				
				mostRecentCallArguments[0](serviceReturnedBooks);
				
				expect(booksRepository.getAll()).toEqual(serviceReturnedBooks);
			});
		});
	});
	
	describe("getAll", function() {
		var options;
		
		beforeEach(function() {
			options = {
				filter: BookFilter.upcoming,
				key: 'all',
			};
		});
		
		it("should pass options to determineFilter", function() {
			spyOn(booksRepository, 'determineFilter');
			
			booksRepository.getAll(options);
		
			expect(booksRepository.determineFilter).toHaveBeenCalledWith(options);
		});
		
		it("should return books filtered by filterAllBy", function() {
			var expectedBooks = BookFactory.createBooks();
			spyOn(BookFilter, 'filterAllBy').andReturn(expectedBooks);
			
			var actualBooks = booksRepository.getAll();

			expect(actualBooks).toBeDefined();
			expect(actualBooks).toEqual(expectedBooks);
		});
	});
	
	describe("determineFilter", function() {
		var options;
		
		beforeEach(function() {
			options = {
				filter: BookFilter.upcoming,
			};
		});
		
		it("should use default when nothing is provided", function() {
			expect(booksRepository.determineFilter()).toEqual(BookFilter.all);
		});
		
		it("should use default when nothing is provided for filter in options", function() {
			options.filter = null;
			
			expect(booksRepository.determineFilter(options)).toEqual(BookFilter.all);
		});
		
		it("should use the provided filter when set", function() {
			expect(booksRepository.determineFilter(options)).toEqual(BookFilter.upcoming);
		});
	});
	
	describe("save", function() {
		var newBook;
		
		beforeEach(function() {
			newBook = BookFactory.createBook();
			newBook.id = null;
		});
		
		it("should save a book and return it", function() {
			var returnedBook = booksRepository.save(newBook);
		
			expect(returnedBook.name).toEqual(newBook.name);
		});
		
		it("should save a book and it should be available in getAll", function() {
			booksRepository.save(newBook);
			
			expect(booksRepository.getAll()).toContain(newBook);
		});
		
		it("should not re-add a book that already exists", function() {
			var originalBooksCount = booksRepository.getAll().length;
			
			booksRepository.save(booksRepository.save(newBook));
			
			expect(booksRepository.getAll().length).toEqual(originalBooksCount + 1);
			expect(booksRepository.getAll()).toContain(newBook);
		});
		
		it("should update an existing book", function() {
			var originalBook = newBook;
			booksRepository.save(originalBook);
			var updatedBook = BookFactory.createBook();
			updatedBook.id = originalBook.id;
			updatedBook.title = 'Updated the title';
			
			booksRepository.save(updatedBook);
			
			expect(booksRepository.getAll()).not.toContain(originalBook);
			expect(booksRepository.getAll()).toContain(updatedBook);
		});
		
		describe("should post the books to the web service", function() {
			var mostRecentCallArguments;
			
			beforeEach(function() {
				mockBooksService.postAllBooksToWebService = jasmine.createSpy("post to web service");
				booksRepository.save(newBook);
				mostRecentCallArguments = mockBooksService.postAllBooksToWebService.mostRecentCall.args; 
			});
			
			it("with all the books", function() {
				expect(mostRecentCallArguments[1]).toEqual([newBook]);
			});
			
			it("and on success, update the repository", function() {
				var serviceReturnedBooks = BookFactory.createBooks();
				
				mostRecentCallArguments[0](serviceReturnedBooks);
				
				expect(booksRepository.getAll()).toEqual(serviceReturnedBooks);
			});
		});
	});

	describe("delete", function() {
		var books;

		beforeEach(function() {
			books = BookFactory.createBooks();
			booksRepository.save(books[0]);
			booksRepository.save(books[1]);
		});

		it("should delete the book from the repository", function() {
			booksRepository.delete(books[0]);
			
			expect(booksRepository.getAll()).not.toContain(books[0]);
		});

		describe("should post the books to the web service", function() {
			var mostRecentCallArguments;

			beforeEach(function() {
				mockBooksService.postAllBooksToWebService = jasmine.createSpy("post to web service");
				booksRepository.delete(books[1]);
				mostRecentCallArguments = mockBooksService.postAllBooksToWebService.mostRecentCall.args; 
			});

			it("with all the books", function() {
				expect(mostRecentCallArguments[1]).toEqual([books[0]]);
			});

			it("and on success, update the repository", function() {
				var serviceReturnedBooks = BookFactory.createBooks();

				mostRecentCallArguments[0](serviceReturnedBooks);

				expect(booksRepository.getAll()).toEqual(serviceReturnedBooks);
			});
		});
	});
});