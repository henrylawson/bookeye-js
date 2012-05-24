describe("BooksService", function() {
	var booksService;
	var mockStatusWidget;
	var mockAjaxHandler;
	
	beforeEach(function() {
		mockAjaxHandler = jasmine.createSpy('ajax spy');
		mockStatusWidget = new StatusWidget($('<div></div>'));
	});
	
	describe("updateHttpService", function() {
		var options;
		var mockSuccessCallback;
		
		beforeEach(function() {
			mockSuccessCallback = jasmine.createSpy('success callback function');
			options = {
				httpVerb: 'POST', 
				action: '/books',	
				data: { books: 'data' },
				async: true,
				messages: {
					started: 'Started!',
					success: 'Success!',
					error: 'Error!',
				},
				callbacks: {
					success: mockSuccessCallback
				}
			};
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
		});
		
		it("should set standard message before sending", function() {
			spyOn(mockStatusWidget, "displayMessage");
			
			booksService.updateHttpService(options);
			
			expect(mockStatusWidget.displayMessage).toHaveBeenCalledWith('Started!');
		});
	
		it("should do the HTTP verb when sending", function() {
			booksService.updateHttpService(options);
		
			expect(mockAjaxHandler.mostRecentCall.args[0].type).toEqual("POST");
		});
	
		it("should have correct URL when sending", function() {
			booksService.updateHttpService(options);
		
			expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
		});
	
		it("should send the correct data payload", function() {
			booksService.updateHttpService(options);
		
			expect(mockAjaxHandler.mostRecentCall.args[0].data).toEqual({ books: 'data' });
		});
	
		
		describe("on complete", function() {
			it("should set success message when sent successfully", function() {
				spyOn(mockStatusWidget, "displaySuccess");
			
				booksService.updateHttpService(options);
				mockAjaxHandler.mostRecentCall.args[0].complete(null, "success");
		
				expect(mockStatusWidget.displaySuccess).toHaveBeenCalledWith('Success!');
			});

			it("should set failure message when sending has failed", function() {
				spyOn(mockStatusWidget, "displayError");
			
				booksService.updateHttpService(options);
				mockAjaxHandler.mostRecentCall.args[0].complete(null, "error");

				expect(mockStatusWidget.displayError).toHaveBeenCalledWith('Error!');
			});
		});
		
		describe("on success", function() {
			var returnedBooks;
			
			beforeEach(function() {
				returnedBooks = [BookFactory.createSerializedBook()];
				booksService.updateHttpService(options);
				mockAjaxHandler.mostRecentCall.args[0].success(returnedBooks);
			});
			
			it("should execute callback with received books when successful", function() {
				expect(mockSuccessCallback).toHaveBeenCalledWith(returnedBooks);
			});
			
			describe("should 'clean' the received serialized books", function() {
				var booksReturnedFromService;
				
				beforeEach(function() {
					booksReturnedFromService = mockSuccessCallback.mostRecentCall.args[0];
				});
				
				it("by converting hasBeenRead to boolean", function() {
					expect(booksReturnedFromService[0].hasBeenRead).toEqual(true);
				});

				it("by converting ownTheBook to boolean", function() {
					expect(booksReturnedFromService[0].ownTheBook).toEqual(true);
				});

				it("by converting ownTheEBook to boolean", function() {
					expect(booksReturnedFromService[0].ownTheEBook).toEqual(false);
				});
			});
		});
	});	
	
	describe("getAllBooksFromWebService", function() {
		var mockSuccessCallback;
		
		beforeEach(function() {
			mockSuccessCallback = jasmine.createSpy("succes callback");
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
			booksService.getAllBooksFromWebService(mockSuccessCallback);
		});
		
		it("should do a HTTP GET", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].type).toEqual("GET");
		});
		
		it("should use /books URL", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
		});

		it("should have no data", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].data).not.toBeDefined();
		});
		
		it("should do a sync call", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].async).toBeFalsy();
		});
		
		it("should call success callback on success", function() {
			mockAjaxHandler.mostRecentCall.args[0].success(BookFactory.createBooks());
			
			expect(mockSuccessCallback).toHaveBeenCalled();
		});
	});
	
	describe("postAllBooksToWebService", function() {
		var mockSuccessCallback;
		var booksToPost;
		
		beforeEach(function() {
			booksToPost = BookFactory.createBooks();
			mockSuccessCallback = jasmine.createSpy("succes callback");
			booksService = new BooksService(mockStatusWidget, mockAjaxHandler);
			booksService.postAllBooksToWebService(mockSuccessCallback, booksToPost);
		});
		
		it("should do a HTTP POST", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].type).toEqual("POST");
		});
		
		it("should use /books URL", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
		});

		it("should have books to post as data", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].data).toEqual({ books: booksToPost });
		});
		
		it("should do an async call", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].async).toBeTruthy();
		});
		
		it("should call success callback on success", function() {
			var books =  BookFactory.createBooks();
			mockAjaxHandler.mostRecentCall.args[0].success(books);
			
			expect(mockSuccessCallback).toHaveBeenCalledWith(books);
		});
	});
});

describe("LookupBooksService", function() {
	var lookupBooksService;
	var mockAjaxHandler;
	var mockStatusWidget;
	
	beforeEach(function() {
		mockAjaxHandler = jasmine.createSpy("ajax handler");
		lookupBooksService = new LookupBooksService(mockAjaxHandler);
	});
	
	describe("search", function() {
		var options;
	
		beforeEach(function() {
			options = { 
				searchTerm: "Continuous Delivery",
				callbacks: {
					success: jasmine.createSpy("success callback"),
					error: jasmine.createSpy("error callback"),
					nothingFound: jasmine.createSpy("nothing found")
				},
				messages: {
					success: "Lookup books returned results",
					error: "Lookup books did not return any results"
				}
			};
			lookupBooksService.search(options);
		});
		
		it("should do a HTTP GET", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].type).toEqual("GET");
		});
		
		it("should use the correct lookup books api url", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("https://www.googleapis.com/books/v1/volumes");
		});
		
		it("should send the search term as the q parameter", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].data.q).toEqual(options.searchTerm);
		});
		
		it("should do a jsonp call", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].dataType).toEqual('jsonp');
		});
		
		it("should have a timeout", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].timeout).toBeDefined();
		});
		
		it("should call success callback on success with a mapped book", function() {
			var results = { items: [] };
			var book = BookFactory.createBook();
			spyOn(lookupBooksService, 'map').andReturn(book);
			mockAjaxHandler.mostRecentCall.args[0].success(results);
			
			expect(options.callbacks.success).toHaveBeenCalledWith(book);
		});
		
		it("should call nothingFound callback when nothing found", function() {
			var results = {};
			mockAjaxHandler.mostRecentCall.args[0].success(results);
			
			expect(options.callbacks.nothingFound).toHaveBeenCalled();
		});
		
		it("should call error callback on error", function() {
			mockAjaxHandler.mostRecentCall.args[0].error();
			
			expect(options.callbacks.error).toHaveBeenCalled();
		});
	});
	
	describe("map", function() {
		var results;
		var book;
		
		beforeEach(function() {
			results = {
				items: [{
						volumeInfo: {
							title: "My title",
							imageLinks: {
								thumbnail:"img",
							},
							publishedDate: "2012-03-09",
							authors:["Jimmy", "Tony"],
						},
				}]
			};
			book = lookupBooksService.map(results);
		});
		
		it("should map the title", function() {
			expect(book.title).toEqual("My title");
		});
		
		it("should map the year", function() {
			expect(book.year).toEqual("2012");
		});
		
		it("should map the author", function() {
			expect(book.author).toEqual("Jimmy, Tony");
		});
		
		it("should map the cover", function() {
			expect(book.cover).toEqual("img");
		});
		
		it("should map and empty stirng for the cover if it does not exist", function() {
			results.items[0].volumeInfo.imageLinks = undefined;
			
			book = lookupBooksService.map(results);
			
			expect(book.cover).toEqual("");
		});
	});
});