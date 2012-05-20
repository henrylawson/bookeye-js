describe("BookFilter", function() {
	var book;
	
	beforeEach(function() {
		book = BookFactory.createBook();
		book.hasBeenRead = false;
		book.ownTheBook = false;
		book.ownTheEBook = false;
	});
	
	describe("all", function() {
		it("should always return true", function() {
			expect(BookFilter.all(book)).toBeTruthy();
		});
	});
	
	describe("upcoming", function() {
		it("should be true for a book that has not been read", function() {
			book.hasBeenRead = false;
			
			expect(BookFilter.upcoming(book)).toBeTruthy();
		});
		
		it("should be false for a book that has been read", function() {
			book.hasBeenRead = true;
			
			expect(BookFilter.upcoming(book)).toBeFalsy();
		});
	});
	
	describe("wishlist", function() {
		it("should be true for a book that has not been read and is not owned", function() {
			book.hasBeenRead = false;
			book.ownTheEBook = false;
			book.ownTheBook = false;
			
			expect(BookFilter.wishlist(book)).toBeTruthy();
		});
		
		it("should be false for a book that has been read", function() {
			book.hasBeenRead = true;
			
			expect(BookFilter.wishlist(book)).toBeFalsy();
		});
		
		it("should be false for a book that has not been read but the ebook is owned", function() {
			book.hasBeenRead = false;
			book.ownTheEBook = true;
			
			expect(BookFilter.wishlist(book)).toBeFalsy();
		});
		
		it("should be false for a book that has not been read but the book is owned", function() {
			book.hasBeenRead = false;
			book.ownTheBook = true;
			
			expect(BookFilter.wishlist(book)).toBeFalsy();
		});
	});
	
	describe("read", function() {
		it("should be false for a book that has not been read", function() {
			book.hasBeenRead = false;
			
			expect(BookFilter.read(book)).toBeFalsy();
		});
		
		it("should be true for a book that has been read", function() {
			book.hasBeenRead = true;
			
			expect(BookFilter.read(book)).toBeTruthy();
		});
	});
});