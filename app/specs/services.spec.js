describe("BooksService", function() {
	var booksService;
	
	beforeEach(function() {
		booksService = new BooksService();
	});
	
	describe("getAll", function() {
		it("should return array of books", function() {
			booksService.save({});
			booksService.save({});
			
			var books = booksService.getAll();
		
			expect(books.length).toEqual(2);
		});	
	});
	
	describe("saveBook", function() {
		it("should save a book and return it", function() {
			var book = {};
			
			var returnedBook = booksService.save(book);
		
			expect(returnedBook).toEqual(book);
		});
		
		it("should save a book and return it in getAll", function() {
			var book = { name: "Awesome, totally unique non existing book name" };
			
			booksService.save(book);
			
			expect(booksService.getAll()).toContain(book);
		});
		
		it("should not re-add a book that already exists in the serivce", function() {
			var book = { name: "Awesome, totally unique non existing book name" };
			var originalBooksCount = booksService.getAll().length;
			
			booksService.save(booksService.save(book));
			
			expect(booksService.getAll().length).toEqual(originalBooksCount + 1);
			expect(booksService.getAll()).toContain(book);
		});
	});
});