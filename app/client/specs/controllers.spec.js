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
		mockBooksRepository = new BooksRepository(mockBooksService);
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
		var details;
		
		beforeEach(function() {
			books = BookFactory.createBooks();
			spyOn(mockBooksRepository, 'getAll').andReturn(books);
			spyOn(mockTitleWidget, 'display');
			details = { 
				title: 'Title', 
				subtext: 'subtext',
				filter: BookFilter.all
			};
		});
		
		it("should get all the books from the repository", function() {
			booksController.all(details);
				
			expect(mockBooksRepository.getAll).toHaveBeenCalledWith(details.filter);
		});
		
		it("should get all the books from the repository", function() {
			booksController.all(details);

			expect(mockTitleWidget.display).toHaveBeenCalledWith(details);
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
			
			describe("with the correct call backs", function() {
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
			
			describe("with the correct call backs", function() {
				it("save callback should execute save action", function() {
					spyOn(booksController, 'delete');
					
					booksController.deleteConfirm(book);
					mockBooksView.deleteConfirm.mostRecentCall.args[0].callbacks.delete(book);

					expect(booksController.delete).toHaveBeenCalled();
				});
			});
		});
	});

	describe("new action", function() {
		describe("should render form view", function() {
			beforeEach(function() {
				spyOn(mockBooksView, 'form');
			});
			
			it("with no book passed in", function() {
				booksController.new();

				expect(mockBooksView.form.mostRecentCall.args[0].book).not.toBeDefined();
			});
			
			it("with the form display element", function() {
				booksController.new();

				expect(mockBooksView.form.mostRecentCall.args[0].displayElement).toEqual(options.displayElements.form);
			});
			
			describe("with correct call backs", function() {
				it("save the callback should execute save action", function() {
					var book = BookFactory.createBook();
					spyOn(booksController, 'save');
					
					booksController.new();
					mockBooksView.form.mostRecentCall.args[0].callbacks.save(book);

					expect(booksController.save).toHaveBeenCalled();
				});
			});
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

		it("should call all action after delete", function() {
			spyOn(booksController, 'all');
		
			booksController.delete(book);
	
			expect(booksController.all).toHaveBeenCalled();
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
		
		it("should call all action after save", function() {
			spyOn(booksController, 'all');
		
			booksController.save(book);
			
			expect(booksController.all).toHaveBeenCalled();
		});
	});
});