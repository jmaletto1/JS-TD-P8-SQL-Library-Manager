// Import Project Dependencies
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
  res.redirect('/books?page=1')
}));

// View All Books
router.get('/books', asyncHandler(async (req, res) => {
  const allBooks = await Book.findAll();

  // Pagination Results Function
  const page = parseFloat(req.query.page);
  const limit = 5;
  const results = allBooks.length;
  let currentpage = 0;

  const startIndex = (page * 5) - 5;
  const endIndex = (page * 5) - 1;

  let resultsPush = {};

  for (let i=0; i<results; i++) {
    if (i >= startIndex && i <= endIndex) {
      resultsPush[i] = {
        id: allBooks[i].id,
        title: allBooks[i].dataValues.title,
        author: allBooks[i].dataValues.author,
        year: allBooks[i].dataValues.year,
        genre: allBooks[i].dataValues.genre
      }
    }
  }

  // Page Links/Buttons Function
  let buttonsArray = [];
  const totalPages = Math.ceil(results / limit);

  for (let x=1; x<= totalPages; x++) {
    buttonsArray.push(x)
  }

  res.render('index', {allBooks: resultsPush, title: "Book List", page, buttonsArray});
}));

// Create New Book Page
router.get('/books/new', (req, res) => {h
  res.render('new-book', {bookEntry: {}, title: "Add a Book!"})
});

// Create Book Route. This route will provide an error if the Title or Author fields are left blank.
router.post('/books/new', asyncHandler(async (req, res) => {
  let bookEntry;
  try {
    bookEntry = await Book.create(req.body);
    res.redirect(`/books/${bookEntry.id}/edit`)
  } catch(error) {
    if (error.name === "SequelizeValidationError") {
      bookEntry = await Book.build(req.body);
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

// Update Book Post Method. This route will also provide an error if the Title or Author fields are left blank.
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

  /* Search Route. This post route accepts a search query, which is then matched against the 
  values in the database using findAll's 'where' keyword. It also uses [Op.like] to find matches
  that are similar to the search query.
  Finally, if there are no matches, a friendly error message is displayed to the user.
  */
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