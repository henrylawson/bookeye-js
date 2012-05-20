describe("BookSorter", function() {
	var bookSorter;
	var key;
	
	beforeEach(function() {
		bookSorter = new BookSorter(key);
	});
	
	describe("determinePriority", function() {
		var book;
		
		beforeEach(function() {
			book = BookFactory.createBook();
		})
		
		it("should return -1 if priority is undefined", function() {
			expect(BookSorter.determinePriority(book)).toEqual(-1);
		});
		
		it("should return -1 if priority for key is undefined", function() {
			book.priority = [];
			
			expect(BookSorter.determinePriority(book)).toEqual(-1);
		});
		
		it("should return priority if defined", function() {
			book.priority = [];
			book.priority[key] = 99;
			
			expect(BookSorter.determinePriority(book)).toEqual(99);
		});
	});
	
	describe("sort", function() {
		var books;

		beforeEach(function() {
			books = [];
			books.push(BookFactory.createBookWithGuid());
			books.push(BookFactory.createBookWithGuid());
			books.push(BookFactory.createBookWithGuid());
			books[0].title = "Book 0";
			books[1].title = "Book 1";
			books[2].title = "Book 2";
		});
		
		it("should keep ordering if books don't have key set", function() {
			books.sort(bookSorter.sort);

			expect(books[0].title).toEqual("Book 0");
			expect(books[1].title).toEqual("Book 1");
			expect(books[2].title).toEqual("Book 2");
		});

		it("should prioritize book if it has key set", function() {
			books[2].priority = [];
			books[2].priority[key] = 1;

			books.sort(bookSorter.sort);

			expect(books[0].title).toEqual("Book 2");
			expect(books[1].title).toEqual("Book 0");
			expect(books[2].title).toEqual("Book 1");
		});		
		
		it("should prioritize book with higher priority", function() {
			books[1].priority = [];
			books[1].priority[key] = 2;
			books[2].priority = [];
			books[2].priority[key] = 1;

			books.sort(bookSorter.sort);

			expect(books[0].title).toEqual("Book 1");
			expect(books[1].title).toEqual("Book 2");
			expect(books[2].title).toEqual("Book 0");
		});
	});
});