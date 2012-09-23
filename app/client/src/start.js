var statusWidget = new StatusWidget($('#status'));
var titleWidget = new TitleWidget($('#title'));
var booksService = new BooksService(statusWidget, $.ajax);
var lookupBooksService = new LookupBooksService($.ajax);
var booksRepository = new BooksRepository(booksService, new BookSorter(), function(callback, time) {
	setTimeout(callback, time);
});
var booksView = new BooksView();
var booksController = new BooksController({
	displayElements: {
		all: $('#all-books'),
		form: $('#modal-storage'),
		deleteConfirm: $('#confirm'),
	},
	view: booksView,
	repository: booksRepository,
	widgets: {
		title: titleWidget
	}
});
var lookupBooksController = new LookupBooksController({
	displayElements: {
		quickAdd: $('#modal-storage'),
	},
	view: new LookupBooksView(),
	controllers: {
		books: booksController
	},
	service: lookupBooksService,
});

var allAction = function() { 
	booksController.all({ 
		title: {
			title: "All", 
			subtext: "Everythang, all the books!",
		},
		repository: {
			key: 'all',
			filter: BookFilter.all
		} 
	});
};
var upcomingAction = function() { 
	booksController.all({ 
		title: {
			title: "Upcoming", 
			subtext: "Must read soon!",
		},
		repository: {
			key: 'upcoming', 
			filter: BookFilter.upcoming
		} 
	});
};
var wishlistAction = function() { 
	booksController.all({ 
		title: {
			title: "Wishlist", 
			subtext: "Gotta get em to read em!",
		},
		repository: {
			key: 'wishlist',
			filter: BookFilter.wishlist
		} 
	}); 
};
var readAction = function() { 
	booksController.all({ 
		title: {
			title: "Read", 
			subtext: "All done!", 
		},
		repository: {
			key: 'read',
			filter: BookFilter.read 
		}
	}); 
};

var navigationWidget = new NavigationWidget($('#navigation ul.items'));
navigationWidget.add("All", allAction);
navigationWidget.add("Upcoming", upcomingAction);
navigationWidget.add("Wishlist", wishlistAction);
navigationWidget.add("Read", readAction);

var rightNavigationWidget = new NavigationWidget($('#navigation ul.right-items'));
rightNavigationWidget.add("Export", function() { window.open("/books") }, '#navigation-widget-item-download');
rightNavigationWidget.add("Quick Add", function() { lookupBooksController.quickAdd() }, '#navigation-widget-item-quick-add');
rightNavigationWidget.add("Add Book", function() { booksController.add() }, '#navigation-widget-item-add');

upcomingAction();