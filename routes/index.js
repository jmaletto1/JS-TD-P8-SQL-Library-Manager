var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');

// Middleware Handler Function
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      next(error);
    }
  }
}

/* Homepage Re-direct */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books')
}));

// View All Books
router.get('/books', asyncHandler(async (req, res) => {
  const allBooks = await Book.findAll();
  res.render('index', {allBooks, title: "Book List"});
}));

// Create New Book Page
router.get('/books/new', (req, res) => {
  res.render('new-book', {bookEntry: {}, title: "Add a Book!"})
});

// Create Book Route
router.post('/books/new', asyncHandler(async (req, res) => {
  let bookEntry;
  try {
    bookEntry = await Book.create(req.body);
    res.redirect(`/books/${bookEntry.id}/edit`)
  } catch(error) {
    if (error.name === "SequelizeValidationError") {
      bookEntry = await Book.build(req.body);
      // res.render("new-book", {bookEntry, message: "Oops! You haven't filled out all fields", title: "Add a Book!"})
      res.render("new-book", {bookEntry, errors: error.errors, title: "Add a Book!"})
    } else {
    console.log("Didn't work!");
    }
  }
}));

// Update Book Route
router.get('/books/:id/edit', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  res.render('update-book', {book})
}))

// Update Book Post Method
router.post('/books/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
    await book.update(req.body);
    res.redirect(`/books/${book.id}/edit`)
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", {book, errors: error.errors})
    } else {
    console.log("Didn't work!");
    }
  }
}));

// Delete Book Route
router.post("/books/:id/delete", asyncHandler(async (req ,res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/");
    })
  );

  // Search Route
  router.post('/books/search', asyncHandler(async (req, res) => {
    const search = req.body.search;
    const allBooks = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search}%`
            }
          },
          {
            author: {
              [Op.like]: `%${search}%`
            }
          },
          {
            genre: {
              [Op.like]: `%${search}%`
            }
          },
          {
            year: {
              [Op.like]: `%${search}%`
            }
          }
        ]
      }
    });
    console.log(allBooks.length)
    
    if (allBooks.length < 1) {
      console.log("No matches!");
      res.render('index', {message: "Unfortunately there are no matches! Why not add a new entry?"});
    } else {
      res.render('index', {allBooks, title: "Book List", searchQ: true});
    }
  }));

module.exports = router;
