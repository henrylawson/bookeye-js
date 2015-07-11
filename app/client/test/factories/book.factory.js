var BookFactory = function() {

}
BookFactory.createBooks = function() {
  return [
    {
      id: null,
      title: "Awesome book",
      author: "Henry",
      year: "2009",
      notes: "Some notes",
      cover: "http://bks9.books.google.co.in/books?id=KjmXSQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      hasBeenRead: true,
      ownTheBook: true,
      ownTheEBook: true,
      ownTheAudiobook: true,
      queuedInSafari: true,
      priority: {
        all: 1
      },
    },
    {
      id: null,
      title: "Awesomer book",
      author: "Tomo",
      year: "2007",
      notes: "Some notes",
      cover: "http://bks9.books.google.co.in/books?id=KjmXSQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      hasBeenRead: false,
      ownTheBook: false,
      ownTheEBook: false,
      ownTheAudiobook: false,
      queuedInSafari: false,
      priority: {
        all: 1
      },
    },
  ];
}
BookFactory.createBook = function() {
  return {
    id: null,
    title: "Awesomest book",
    author: "Henry",
    year: "2009",
    notes: "Some notes",
    cover: "http://bks9.books.google.co.in/books?id=KjmXSQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    hasBeenRead: true,
    ownTheBook: true,
    ownTheEBook: true,
    ownTheAudiobook: true,
    queuedInSafari: true,
    priority: {
      all: 1
    },
  };
}
BookFactory.createBookWithGuid = function() {
  var book = BookFactory.createBook();
  book.id = BooksRepository.guid();
  return book;
}
BookFactory.createSerializedBook = function() {
  return {
    id: BooksRepository.guid(),
    title: "Awesomest book",
    author: "Henry",
    year: "2009",
    notes: "Some notes",
    cover: "http://bks9.books.google.co.in/books?id=KjmXSQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    hasBeenRead: 'true',
    ownTheBook: 'true',
    ownTheEBook: 'false',
    queuedInSafari: 'false',
    priority: {
      all: '1'
    },
  };
}
