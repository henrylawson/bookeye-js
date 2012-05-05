describe("BooksService", function() {
	var booksService;
	
	beforeEach(function() {
		booksService = new BooksService();
	});
	
	describe("getAll", function() {
		it("should return an array of books", function() {
			var books = booksService.getAll();
		
			expect(books.length).toBeGreaterThan(0);
		});	
	});
	
	describe("saveBook", function() {
		it("should save a book and return it", function() {
			var book = booksService.save({});
		
			expect(book).toEqual({});
		});
	});
});