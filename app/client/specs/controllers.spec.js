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
		it("should render all books view", function() {
			var books = BookFactory.createBooks();
			spyOn(mockBooksView, 'all');
			spyOn(mockBooksRepository, 'getAll').andReturn(books);
		
			booksController.all();
			
			expect(mockBooksView.all).toHaveBeenCalled();
			expect(mockBooksRepository.getAll).toHaveBeenCalled();
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

		it("should call all book view", function() {
			spyOn(mockBooksView, 'all');
		
			booksController.delete(book);
	
			expect(mockBooksView.all).toHaveBeenCalled();
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
		
		it("should call all book view", function() {
			spyOn(mockBooksView, 'all');
		
			booksController.save(book);
			
			expect(mockBooksView.all).toHaveBeenCalled();
		});
	});
});