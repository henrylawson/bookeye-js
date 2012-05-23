describe("BooksController", function() {
	var booksController;
	var mockBooksRepository;
	var mockBooksView;
	var options;

	beforeEach(function() {
		mockBooksView = new BooksView();
		mockStatusWidget = new StatusWidget($('<div></div>'));
		mockTitleWidget = new TitleWidget($('<div></div>'));
		mockBooksService = new BooksService(mockStatusWidget, jasmine.createSpy('ajax service'));
		mockBooksRepository = new BooksRepository(mockBooksService, new BookSorter());
		options = {
			displayElements: {
				all: $('<div></dv>'),
				form: $('<div></dv>'),
				deleteConfirm: $('<div></dv>'),
			},
			view: mockBooksView,
			repository: mockBooksRepository,
			widgets: {
				title: mockTitleWidget
			}
		};
		booksController = new BooksController(options);
	});
	
	describe("all action", function() {
		var books;
		var actionOptions;
		
		beforeEach(function() {
			books = BookFactory.createBooks();
			spyOn(mockBooksRepository, 'getAll').andReturn(books);
			spyOn(mockTitleWidget, 'display');
			actionOptions = { 
				title: {
					title: 'Title', 
					subtext: 'subtext',
				},
				repository: {
					key: 'default',
					filter: BookFilter.all
				}
			};
			booksController.all(actionOptions);
		});
		
		it("should get all the books from the repository", function() {
			expect(mockBooksRepository.getAll).toHaveBeenCalledWith(actionOptions.repository);
		});
		
		it("should get all the books from the repository", function() {
			expect(mockTitleWidget.display).toHaveBeenCalledWith(actionOptions.title);
		});
		
		it("should use previously set details when non are provided", function() {
			booksController.all();
			
			expect(mockTitleWidget.display).toHaveBeenCalledWith(actionOptions.title);
		});
		
		describe("should render all view", function() {
			beforeEach(function() {
				spyOn(mockBooksView, 'all');
			});
			
			it("with all the books passed in", function() {
				booksController.all();

				expect(mockBooksView.all.mostRecentCall.args[0].books).toEqual(books);
			});
			
			it("with the all display element", function() {
				booksController.all();

				expect(mockBooksView.all.mostRecentCall.args[0].displayElement).toEqual(options.displayElements.all);
			});
			
			describe("with the correct call backs", function() {
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

				it("moveUp callback should execute move action with up set true", function() {
					spyOn(booksController, 'move');

					booksController.all();
					mockBooksView.all.mostRecentCall.args[0].callbacks.move(true, books[0])

					expect(booksController.move).toHaveBeenCalledWith(true, books[0]);
				});
				
				it("moveDown callback should execute move action with up set false", function() {
					spyOn(booksController, 'move');

					booksController.all();
					mockBooksView.all.mostRecentCall.args[0].callbacks.move(false, books[0])

					expect(booksController.move).toHaveBeenCalledWith(false, books[0]);
				});
			});
		});
	});
		
	describe("edit action", function() {
		describe("should render form view", function() {
			var book;
			
			beforeEach(function() {
				book = BookFactory.createBook();
				spyOn(mockBooksView, 'form');
			});
			
			it("with the book passed in", function() {
				booksController.edit(book);

				expect(mockBooksView.form.mostRecentCall.args[0].book).toEqual(book);
			});
			
			it("with the form display element", function() {
				booksController.edit(book);

				expect(mockBooksView.form.mostRecentCall.args[0].displayElement).toEqual(options.displayElements.form);
			});
			
			describe("with the correct callbacks", function() {
				it("save callback should execute save action", function() {
					spyOn(booksController, 'save');
					
					booksController.edit(book);
					mockBooksView.form.mostRecentCall.args[0].callbacks.save(book);

					expect(booksController.save).toHaveBeenCalled();
				});
			});
		});
	});
	
	describe("deleteConfirm action", function() {
		describe("should render delete confirm view", function() {
			var book;
			
			beforeEach(function() {
				book = BookFactory.createBook();
				spyOn(mockBooksView, 'deleteConfirm');
			});
			
			it("with the book passed in", function() {
				booksController.deleteConfirm(book);

				expect(mockBooksView.deleteConfirm.mostRecentCall.args[0].book).toEqual(book);
			});
			
			it("with the deleteConfirm display element", function() {
				booksController.deleteConfirm(book);

				expect(mockBooksView.deleteConfirm.mostRecentCall.args[0].displayElement).toEqual(options.displayElements.deleteConfirm);
			});
			
			describe("with the correct callbacks", function() {
				it("delete callback should execute delete action", function() {
					spyOn(booksController, 'delete');
					
					booksController.deleteConfirm(book);
					mockBooksView.deleteConfirm.mostRecentCall.args[0].callbacks.delete(book);

					expect(booksController.delete).toHaveBeenCalled();
				});
			});
		});
	});

	describe("add action", function() {
		describe("should render form view", function() {
			beforeEach(function() {
				spyOn(mockBooksView, 'form');
			});
			
			it("with no book passed in", function() {
				booksController.add();

				expect(mockBooksView.form.mostRecentCall.args[0].book).not.toBeDefined();
			});
			
			it("with the form display element", function() {
				booksController.add();

				expect(mockBooksView.form.mostRecentCall.args[0].displayElement).toEqual(options.displayElements.form);
			});
			
			describe("with correct callbacks", function() {
				it("save the callback should execute save action", function() {
					var book = BookFactory.createBook();
					spyOn(booksController, 'save');
					
					booksController.add();
					mockBooksView.form.mostRecentCall.args[0].callbacks.save(book);

					expect(booksController.save).toHaveBeenCalled();
				});
			});
		});
	});
	
	describe("move action", function() {
		var book;
		var details;

		beforeEach(function() {
			book = BookFactory.createBook();
			options = {
				title: {
					title: "Test",
					subtext: "Yo",
				},
				repository: {
					key: 'all',
				}
			};
			booksController.all(options);							
			spyOn(booksController, 'all');
		});

		it("should delegate move to repository", function() {
			spyOn(mockBooksRepository, 'move');

			booksController.move(book, book);
	
			expect(mockBooksRepository.move).toHaveBeenCalledWith(book, book, options.repository.key);
		});

		it("should call all action after move", function() {
			booksController.move(book, book);
	
			expect(booksController.all).toHaveBeenCalled();
		});
	});
	
	describe("delete action", function() {
		var book;

		beforeEach(function() {
			spyOn(booksController, 'all');
			book = BookFactory.createBook();
			booksController.save(book);
		});

		it("should save book to repository", function() {
			spyOn(mockBooksRepository, 'delete');

			booksController.delete(book);
	
			expect(mockBooksRepository.delete).toHaveBeenCalledWith(book);
		});

		it("should call all action after delete", function() {
			booksController.delete(book);
	
			expect(booksController.all).toHaveBeenCalled();
		});
	});
		
	describe("save action", function() {
		var book;
		
		beforeEach(function() {
			spyOn(booksController, 'all');
			book = BookFactory.createBook();
		});
		
		it("should save book to repository", function() {
			spyOn(mockBooksRepository, 'save');
		
			booksController.save(book);
			
			expect(mockBooksRepository.save).toHaveBeenCalledWith(book);
		});
		
		it("should call all action after save", function() {
			booksController.save(book);
			
			expect(booksController.all).toHaveBeenCalled();
		});
	});
});

describe("LookupBooksController", function() {
	var options;
	
	beforeEach(function() {
		options = {
			displayElements: {
				quickAdd: $('<div></div>'),
			},
			view: new LookupBooksView(),
			controllers: {
				books: new BooksController()
			},
			service: new LookupBooksService(),
		};
		lookupBooksController = new LookupBooksController(options);
	});
	
	describe("quickAdd action", function() {
		describe("should render quickAdd view", function() {
			beforeEach(function() {
				spyOn(options.view, 'quickAdd');
			});
			
			it("with the quickAdd display element", function() {
				lookupBooksController.quickAdd();

				expect(options.view.quickAdd.mostRecentCall.args[0].displayElement).toEqual(options.displayElements.quickAdd);
			});
			
			describe("with the correct callbacks", function() {
				it("search callback should execute search action", function() {
					var searchTerm = "Some book";
					spyOn(lookupBooksController, 'search');
					
					lookupBooksController.quickAdd();
					options.view.quickAdd.mostRecentCall.args[0].callbacks.search(searchTerm);

					expect(lookupBooksController.search).toHaveBeenCalledWith(searchTerm);
				});
			});
		});
	});
	
	describe("search action", function() {
		describe("should query service using searchTerm view", function() {
			var searchTerm;
			
			beforeEach(function() {
				searchTerm = "Continuous Delivery";
				spyOn(options.service, 'search');
			});
			
			it("with the searchResult display element", function() {
				lookupBooksController.search(searchTerm);

				expect(options.service.search.mostRecentCall.args[0].searchTerm).toEqual(searchTerm);
			});
			
			describe("with the message defined", function() {
				it("for success", function() {
					lookupBooksController.search(searchTerm);

					expect(options.service.search.mostRecentCall.args[0].messages.success).toBeDefined();
				});
				
				it("for error", function() {
					lookupBooksController.search(searchTerm);

					expect(options.service.search.mostRecentCall.args[0].messages.error).toBeDefined();
				});
			});
			
			describe("with the correct callbacks", function() {
				it("success callback should execute searchResult action", function() {
					var book = BookFactory.createBook();
					spyOn(lookupBooksController, 'searchResult');
					
					lookupBooksController.search(searchTerm);
					options.service.search.mostRecentCall.args[0].callbacks.success(book);

					expect(lookupBooksController.searchResult).toHaveBeenCalledWith(book);
				});
			});
		});
	});
	
	describe("searchResult action", function() {
		describe("should render searchResult view", function() {
			var book;
			
			beforeEach(function() {
				book = BookFactory.createBook();
				spyOn(options.view, 'searchResult');
				lookupBooksController.quickAdd();
			});
			
			it("with the searchResult display element", function() {
				lookupBooksController.searchResult(book);

				expect(options.view.searchResult.mostRecentCall.args[0].displayElement).toEqual(options.displayElements.quickAdd);
			});

			it("with the book for display", function() {
				lookupBooksController.searchResult(book);

				expect(options.view.searchResult.mostRecentCall.args[0].book).toEqual(book);
			});
		
			describe("with the correct callbacks", function() {
				it("add callback should execute books controller add action", function() {
					spyOn(options.controllers.books, 'save');
					
					lookupBooksController.searchResult(book);
					options.view.searchResult.mostRecentCall.args[0].callbacks.add(book);

					expect(options.controllers.books.save).toHaveBeenCalledWith(book);
				});
			});
		});
	});
});