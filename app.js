var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const db = require('./models/index');
const { sequelize, Book } = require('./models');

// const {Book} = db.models;
const {Op} = db.Sequelize;

(async () => {
  await sequelize.sync()
  try {
    // const bookById = await Book.create({
    //   title: "Sherlock Holmes",
    //   author: "Sir Athur Conan Doyle",
    //   genre: 'Detective',
    //   year: 1700
    // })

    // const bookById = await Book.findByPk(1);
    // console.log(bookById.toJSON());

    // const allBooks = await Book.findAll();
    // console.log(allBooks.map(books => books.toJSON()));
    // await sequelize.authenticate();
    // console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();


var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
const book = require('./models/book');
// var books = require('./routes/book');
// const { Sequelize } = require('sequelize/types');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Unfortunately you seem to have stumbled on to a page that doesn't exist yet! Please return to the homepage and check out our great collection of books.");
  err.status = 404;
  next(err);
  // next(createError(404));
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('errors');
// });

  /* Global Error Handler.
Errors that are not 404s are passed to the 'error' template.
*/
app.use((err, req, res, next) => {
  res.locals.error = err;
  if (err.status === 404) {
      console.log("Unfortunately this link is not valid! Please return to the homepage.")
      res.locals.message = 'Not found!!!';
      res.status(404).render('page-not-found', { err });
  } else {
      console.log("Unfortunately there seems to have been a server error! Please return to the homepage.")
      err.message = `Oops!  It looks like something went wrong on the server.`;
      err.status = 500 || err.status;
      res.status(500).render('error', { err });
  }
});

module.exports = app;
