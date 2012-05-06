var BookFactory = function() {
	
}
BookFactory.createBooks = function() {
	return [
		{ id: 5, title: "Awesome book", author: "Henry" },
		{ id: 9, title: "Awesomer book", author: "Tom" },
	];
}
BookFactory.createBook = function() {
	return { id: 5, title: "Awesome book", author: "Henry" };
}