<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const booksController = require('../../controllers/booksController');
const { upload } = require('../../controllers/booksController'); // Ensure this path is correct

// Route to get all books
router.route('/').get(booksController.getAllBooks);

// Route to delete a book by ID
router.route('/:id').delete(booksController.deleteBook);

// Route to get a single book by ID
router.route('/editBook/:id').get(booksController.getBook);

// Route to create a new book with file upload
router.route('/addBook').post(upload.single('pdf'), booksController.createNewBook);

// Route to update an existing book with optional file upload
router.route('/editBook/:id').put(upload.single('pdf'), booksController.updateBook);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const booksController = require('../../controllers/booksController');

router.route('/').get(booksController.getAllBooks);

router.route('/:id').delete(booksController.deleteBook);

router.route('/addBook').post(booksController.createNewBook);

router.route('/editBook/:id').put(booksController.updateBook);
router.route('/editBook/:id').get(booksController.getBook);

module.exports = router;
>>>>>>> a16c129e84ced801d680ab3b52a17d3d3bc7123e
