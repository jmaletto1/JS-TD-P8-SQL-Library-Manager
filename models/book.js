// 'use strict';
const Sequelize = require('sequelize');

/* Initialise the Book model, and set the columns to their relevant data type.
Validation checks (and messages) are also provided for the Title and Author columns.
*/
module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Please enter a book title!"},
        notEmpty: {msg: "Please submit a book title!"}
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Please be sure to enter an author!"},
        notEmpty: {msg: "Please submit an author!"}
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    sequelize,
  });
  return Book;
};