var BooksService = function() {
	
}
BooksService.prototype.getAll = function() {
	return [
		{ 
			id: 5, 
			title: "Awesome book", 
			author: "Henry",
			year: "2009",
			cover: "http://bks9.books.google.co.in/books?id=KjmXSQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
			hasBeenRead: true,
			ownTheBook: true,
			ownTheEBook: true
		},
		{ 
			id: 9, 
			title: "Awesomer book", 
			author: "Tomo",
			year: "2007",
			cover: "http://bks9.books.google.co.in/books?id=KjmXSQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
			hasBeenRead: false,
			ownTheBook: false,
			ownTheEBook: false
		},
	];
}
BooksService.prototype.save = function(book) {
	return book;
}