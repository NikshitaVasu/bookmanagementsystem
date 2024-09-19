const fsPromises = require('fs').promises;
const path = require('path');
const multer = require('multer');



// Custom storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Destination function called');
    cb(null, path.join(__dirname, '..', 'uploads')); // Correct path without extra space
  },
  filename: function (req, file, cb) {
    console.log(' function called');
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const data = {
  books: require('../model/books.json'),
  setBooks: function (data) {
    this.books = data;
  },
};

// Get all books
const getAllBooks = (req, res) => {
  res.json(data.books);
};

// Get a single book by ID
const getBook = (req, res) => {
  const book = data.books.find((bk) => bk.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: `Book ID ${req.params.id} not found!` });
  }
  res.json(book);
};

// Create a new book
const createNewBook = async (req, res) => {
  const { title, author, no_of_pages, published_at, genre, pdf, reading_status } = req.body;

  // Validate required fields
  if (!title || !author || !no_of_pages || !published_at || !genre) {
    return res.status(400).json({ message: 'Please enter all required details!' });
  }

  // Create new book object
  const newBook = {
    id: data.books.length ? data.books[data.books.length - 1].id + 1 : 1,
    title,
    author,
    no_of_pages: parseInt(no_of_pages),
    published_at,
    genre,
   
    reading_status: reading_status || 'Not available' // Handle reading_status
  };



   // Handle PDF update
   if (req.file) {
    newBook.pdf = req.file.filename; // Update to use the file name
  }

  try {
    // Update the book data and write to file
    data.setBooks([...data.books, newBook]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'books.json'),
      JSON.stringify(data.books)
    );
    res.status(201).json({ message: 'Book added successfully!' });
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Update a book
const updateBook = async (req, res) => {
  const { id, title, author, no_of_pages, published_at, genre, reading_status } = req.body;

  const updatedBook = data.books.find((bk) => bk.id === parseInt(id));
  if (!updatedBook) {
    return res.status(404).json({ message: `Book ID ${id} not found` });
  }

  if (!title || !author || !no_of_pages || !published_at || !genre) {
    return res.status(400).json({ message: 'Please do not leave empty fields!' });
  }

  updatedBook.title = title;
  updatedBook.author = author;
  updatedBook.no_of_pages = parseInt(no_of_pages);
  updatedBook.published_at = published_at;
  updatedBook.genre = genre;
  updatedBook.reading_status = reading_status || 'Not available'; // Update reading_status

  // Handle PDF update
  if (req.file) {
    updatedBook.pdf = req.file.filename; // Update to use the file name
  }

  console.log(req.file,'req update')

  try {
    data.setBooks(data.books.map((bk) => (bk.id === parseInt(id) ? updatedBook : bk)));
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'books.json'), JSON.stringify(data.books));
    res.json({ message: 'Book updated successfully!' });
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const book = data.books.find((bk) => bk.id === bookId);
  if (!book) {
    return res.status(404).json({ message: `Book ID ${bookId} not found` });
  }

  try {
    data.setBooks(data.books.filter((bk) => bk.id !== bookId));
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'books.json'), JSON.stringify(data.books));
    res.json({ message: 'Book deleted successfully!' });
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAllBooks, getBook, createNewBook, updateBook, deleteBook, upload };
