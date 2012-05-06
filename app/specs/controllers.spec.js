describe("BooksController", function() {
	var booksController;
	var mockBooksService;
	var mockBooksView;

	beforeEach(function() {
		mockBooksView = new BooksView();
		mockBooksService = new BooksService(new StatusWidget(), jasmine.createSpy('ajax handler'));
		booksController = new BooksController($('<div></dv>'), mockBooksView, mockBooksService);
	});
	
	describe("all", function() {
		it("should render all books view", function() {
			var books = BookFactory.createBooks();
			spyOn(mockBooksView, 'all');
			spyOn(mockBooksService, 'getAll').andReturn(books);
		
			booksController.all();
			
			expect(mockBooksView.all).toHaveBeenCalled();
			expect(mockBooksService.getAll).toHaveBeenCalled();
		});
	});
		
	describe("edit", function() {
		it("should render edit view", function() {
			var book = BookFactory.createBook();
			spyOn(mockBooksView, 'form');
		
			booksController.edit(book);
			
			expect(mockBooksView.form).toHaveBeenCalled();
		});
	});

	describe("new", function() {
		it("should render new view", function() {
			spyOn(mockBooksView, 'form');

			booksController.new();

			expect(mockBooksView.form).toHaveBeenCalled();
		});
	});
		
	describe("save", function() {
		var book;
		
		beforeEach(function() {
			book = BookFactory.createBook();
			spyOn(mockBooksView, 'all');
		});
		
		it("should save book to service", function() {
			spyOn(mockBooksService, 'save');
		
			booksController.save(book);
			
			expect(mockBooksService.save).toHaveBeenCalledWith(book);
		});
		
		it("should call all book view", function() {
			booksController.save(book);
			
			expect(mockBooksView.all).toHaveBeenCalled();
		});
	});
});