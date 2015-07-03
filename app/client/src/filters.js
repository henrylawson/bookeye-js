var BookFilter = {};
BookFilter.all = function(book) {
  return true;
}
BookFilter.upcoming = function(book) {
  return book.hasBeenRead === false;
}
BookFilter.wishlist = function(book) {
  return book.hasBeenRead === false
    && book.ownTheEBook === false
    && book.ownTheBook === false
    && book.ownTheAudiobook === false;
}
BookFilter.read = function(book) {
  return book.hasBeenRead === true;
}
BookFilter.filterAllBy = function(books, filter) {
  var filteredBooks = [];
  for(var i = 0; i < books.length; i++) {
    if (filter(books[i]) === true) {
      filteredBooks.push(books[i]);
    }
  }
  return filteredBooks;
}
