describe("BooksController", function() {
	var booksController;
	var mockBooksRepository;
	var mockBooksView;
	var options;

	beforeEach(function() {
		mockBooksView = new BooksView();
		mockStatusWidget = new StatusWidget($('<div></div>'));
		mockBooksService = new BooksService(mockStatusWidget, jasmine.createSpy('ajax service'));
		mockBooksRepository = new BooksRepository(mockBooksService);
		booksController = new BooksController({
			displayElements: {
				all: $('<div></dv>'),
				form: $('<div></dv>'),
				deleteConfirm: $('<div></dv>'),
			},
			view: mockBooksView,
			repository: mockBooksRepository,
		});
	});
	
	describe("all action", function() {
		var books;
		
		beforeEach(function() {
			books = BookFactory.createBooks();
			spyOn(mockBooksRepository, 'getAll').andReturn(books);
		});
		
		it("should get all the books from the repository", function() {
			booksController.all();
				
			expect(mockBooksRepository.getAll).toHaveBeenCalled();
		});
		
		describe("should render all view", function() {
			beforeEach(function() {
				spyOn(mockBooksView, 'all');
			});
			
			it("with all the books passed in", function() {
				booksController.all();

				expect(mockBooksView.all.mostRecentCall.args[0].books).toEqual(books);
			});
			
			describe("with correct call backs", function() {
				it("edit callback should execute edit action", function() {
					spyOn(booksController, 'edit');
					
					booksController.all();
					mockBooksView.all.mostRecentCall.args[0].callbacks.edit(books[0])

					expect(booksController.edit).toHaveBeenCalledWith(books[0]);
				});
				
				it("delete callback should execute deleteConfirm action", function() {
					spyOn(booksController, 'deleteConfirm');

					booksController.all();
					mockBooksView.all.mostRecentCall.args[0].callbacks.delete(books[0])

					expect(booksController.deleteConfirm).toHaveBeenCalledWith(books[0]);
				});
			});
		});
	});
		
	describe("edit action", function() {
		it("should render edit view", function() {
			var book = BookFactory.createBook();
			spyOn(mockBooksView, 'form');
		
			booksController.edit(book);
			
			expect(mockBooksView.form).toHaveBeenCalled();
		});
	});
	
	describe("deleteConfirm action", function() {
		it("should render delete confirm view", function() {
			var book = BookFactory.createBook();
			spyOn(mockBooksView, 'deleteConfirm');
	
			booksController.deleteConfirm(book);
		
			expect(mockBooksView.deleteConfirm).toHaveBeenCalled();
		});
	});

	describe("new action", function() {
		it("should render new view", function() {
			spyOn(mockBooksView, 'form');

			booksController.new();

			expect(mockBooksView.form).toHaveBeenCalled();
		});
	});
	
	describe("delete action", function() {
		var book;

		beforeEach(function() {
			book = BookFactory.createBook();
			booksController.save(book);
		});

		it("should save book to service", function() {
			spyOn(mockBooksRepository, 'delete');

			booksController.delete(book);
	
			expect(mockBooksRepository.delete).toHaveBeenCalledWith(book);
		});

		it("should call all action after delete", function() {
			spyOn(booksController, 'all');
		
			booksController.delete(book);
	
			expect(booksController.all).toHaveBeenCalled();
		});
	});
		
	describe("save action", function() {
		var book;
		
		beforeEach(function() {
			book = BookFactory.createBook();
		});
		
		it("should save book to service", function() {
			spyOn(mockBooksRepository, 'save');
		
			booksController.save(book);
			
			expect(mockBooksRepository.save).toHaveBeenCalledWith(book);
		});
		
		it("should call all action after save", function() {
			spyOn(booksController, 'all');
		
			booksController.save(book);
			
			expect(booksController.all).toHaveBeenCalled();
		});
	});
});