describe("BookSorter", function() {
	var bookSorter;
	var key;
	
	beforeEach(function() {
		bookSorter = new BookSorter();
		bookSorter.setKey(key);
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
	
	describe("setPriortiesForCurrentOrder", function() {
		var books;

		beforeEach(function() {
			books = [];
			books.push(BookFactory.createBookWithGuid());
			books.push(BookFactory.createBookWithGuid());
			books.push(BookFactory.createBookWithGuid());
		});
		
		it("should set priority from high to low from index 0", function() {
			bookSorter.setPriortiesForCurrentOrder(books);
			
			expect(books[0].priority[key]).toEqual(3);
			expect(books[1].priority[key]).toEqual(2);
			expect(books[2].priority[key]).toEqual(1);
		});
		
		it("should not remove existing priorities", function() {
			books[0].priority = {};
			books[0].priority['other'] = 99; 
			bookSorter.setPriortiesForCurrentOrder(books);
			
			expect(books[0].priority[key]).toEqual(3);
			expect(books[0].priority['other']).toEqual(99);
		});
		
		it("should return true if at least one priority changed", function() {
			var updated = bookSorter.setPriortiesForCurrentOrder(books);
			
			expect(updated).toBeTruthy();
		});
		
		it("should return false if no priorities changed", function() {
			bookSorter.setPriortiesForCurrentOrder(books);
			var updated = bookSorter.setPriortiesForCurrentOrder(books);
			
			expect(updated).toBeFalsy();
		});
	});
});