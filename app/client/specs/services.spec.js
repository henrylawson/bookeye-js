describe("BooksService", function() {
	var booksService;
	var mockStatusWidget;
	var mockAjaxHandler;
	
	beforeEach(function() {
		mockAjaxHandler = jasmine.createSpy('ajax spy');
		mockStatusWidget = new StatusWidget();
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
					completeSuccess: 'Success!',
					completeFailure: 'Error!',
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
		
		it("should hit /books URL", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
		});

		it("should have the correct data", function() {
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
		
		it("should hit /books URL", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].url).toEqual("/books");
		});

		it("should have the correct data", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].data).toEqual({ books: booksToPost });
		});
		
		it("should do a sync call", function() {
			expect(mockAjaxHandler.mostRecentCall.args[0].async).toBeTruthy();
		});
		
		it("should call success callback on success", function() {
			mockAjaxHandler.mostRecentCall.args[0].success(BookFactory.createBooks());
			
			expect(mockSuccessCallback).toHaveBeenCalled();
		});
	});
});