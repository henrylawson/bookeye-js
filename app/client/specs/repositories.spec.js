describe("BooksRepository", function() {
	var booksRepository;
	var mockStatusWidget;
	var mockAjaxHandler;
	var mockBookSorter;
	
	beforeEach(function() {
		mockStatusWidget = new StatusWidget($('<div></div>'));
		mockBookSorter = new BookSorter();
		mockBooksService = new BooksService(mockStatusWidget, jasmine.createSpy('ajax service'));
		booksRepository = new BooksRepository(mockBooksService, mockBookSorter);
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
				booksRepository = new BooksRepository(mockBooksService, mockBookSorter);
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
			
			var actualBooks = booksRepository.getAll(options);

			expect(actualBooks).toBeDefined();
			expect(actualBooks).toEqual(expectedBooks);
		});
		
		it("should call setKey on book sorter", function() {
			spyOn(mockBookSorter, 'setKey');
			
			var actualBooks = booksRepository.getAll();
			
			expect(mockBookSorter.setKey).toHaveBeenCalledWith(options.key);
		});
		
		it("should call sort on filtered books with book sorter sort method", function() {
			var filteredBooks = BookFactory.createBooks();
			spyOn(filteredBooks, 'sort');
			spyOn(BookFilter, 'filterAllBy').andReturn(filteredBooks);
			
			var actualBooks = booksRepository.getAll();
			
			expect(filteredBooks.sort).toHaveBeenCalledWith(mockBookSorter.sort);
		});
		
		it("should reset the priorities for the sorted and filtered books", function() {
			var expectedBooks = BookFactory.createBooks();
			spyOn(BookFilter, 'filterAllBy').andReturn(expectedBooks);
			spyOn(mockBookSorter, 'setPriortiesForCurrentOrder');

			booksRepository.getAll();

			expect(mockBookSorter.setPriortiesForCurrentOrder).toHaveBeenCalledWith(expectedBooks);
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
	
	describe("determineKey", function() {
		var options;
		
		beforeEach(function() {
			options = {
				key: 'upcoming',
			};
		});
		
		it("should use default when nothing is provided", function() {
			expect(booksRepository.determineKey()).toEqual('all');
		});
		
		it("should use default when nothing is provided for key in options", function() {
			options.key = null;
			
			expect(booksRepository.determineKey(options)).toEqual('all');
		});
		
		it("should use the provided key when set", function() {
			expect(booksRepository.determineKey(options)).toEqual('upcoming');
		});
	});
	
	describe("saveMultiple", function() {
		var books;
		
		beforeEach(function() {
			books = BookFactory.createBooks();
		});
		
		it("should call addOrUpdate for each book", function() {
			spyOn(booksRepository, "addOrUpdate");
			
			booksRepository.saveMultiple(books);
			
			expect(booksRepository.addOrUpdate.argsForCall[0][0]).toEqual(books[0]);
			expect(booksRepository.addOrUpdate.argsForCall[1][0]).toEqual(books[1]);
		});
			
		it("should call updateWebService", function() {
			spyOn(booksRepository, "updateWebService");

			booksRepository.saveMultiple(books);

			expect(booksRepository.updateWebService).toHaveBeenCalled();
		});
	});
	
	describe("addOrUpdate", function() {
		var newBook;
		
		beforeEach(function() {
			newBook = BookFactory.createBook();
		});
		
		it("should add a book and it should be available in getAll", function() {
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
	})
	
	describe("save", function() {
		var newBook;
		
		beforeEach(function() {
			newBook = BookFactory.createBook();
		});
		
		it("should save a book and return it", function() {
			var returnedBook = booksRepository.save(newBook);
		
			expect(returnedBook.name).toEqual(newBook.name);
		});
		
		
		it("should call addOrUpdate for the book", function() {
			spyOn(booksRepository, "addOrUpdate");
			
			booksRepository.save(newBook);
			
			expect(booksRepository.addOrUpdate).toHaveBeenCalledWith(newBook);
		});
			
		it("should call updateWebService", function() {
			spyOn(booksRepository, "updateWebService");

			booksRepository.save(newBook);

			expect(booksRepository.updateWebService).toHaveBeenCalled();
		});
	});
	
	describe("updateWebService", function() {
		var newBook;
		var mostRecentCallArguments;
		
		beforeEach(function() {
			newBook = BookFactory.createBook();
			mockBooksService.postAllBooksToWebService = jasmine.createSpy("post to web service");
			booksRepository.save(newBook);
			mostRecentCallArguments = mockBooksService.postAllBooksToWebService.mostRecentCall.args; 
		});
		
		it("should post with all the books", function() {
			expect(mostRecentCallArguments[1]).toEqual([newBook]);
		});
		
		it("should update the books list on success", function() {
			var serviceReturnedBooks = BookFactory.createBooks();
			
			mostRecentCallArguments[0](serviceReturnedBooks);
			
			expect(booksRepository.getAll()).toEqual(serviceReturnedBooks);
		});
	});
	
	describe("move", function() {
		var bookToSwap;
		var book;
		var key;
		
		beforeEach(function() {
			key = 'all';
			bookToSwap = BookFactory.createBook();
			book = BookFactory.createBook();
			bookToSwap.priority[key] = 99;
			book.priority[key] = 20;
		});
		
		it("should not change books priority if bookToSwap is undefined", function() {
			booksRepository.move(undefined, book, key);
			
			expect(book.priority[key]).toEqual(20);
		});
		
		it("should swap the priorities of both books for the given key", function() {
			booksRepository.move(bookToSwap, book, key);
			
			expect(bookToSwap.priority[key]).toEqual(20);
			expect(book.priority[key]).toEqual(99);
		});
		
		it("should call addOrUpdate for both books", function() {
			spyOn(booksRepository, "addOrUpdate");

			booksRepository.move(bookToSwap, book, key);

			expect(booksRepository.addOrUpdate).toHaveBeenCalledWith(book);
			expect(booksRepository.addOrUpdate).toHaveBeenCalledWith(bookToSwap);
		});

		it("should call updateWebService on successful move", function() {
			spyOn(booksRepository, "updateWebService");

			booksRepository.move(bookToSwap, book, key);

			expect(booksRepository.updateWebService).toHaveBeenCalled();
		});
		
		it("should not call updateWebService on unsuccessful move", function() {
			spyOn(booksRepository, "updateWebService");

			booksRepository.move(undefined, book, key);

			expect(booksRepository.updateWebService).not.toHaveBeenCalled();
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
			
		it("should call updateWebService", function() {
			spyOn(booksRepository, "updateWebService");

			booksRepository.delete(books[0]);

			expect(booksRepository.updateWebService).toHaveBeenCalled();
		});
	});
});