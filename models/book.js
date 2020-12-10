// 'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Please enter a book title!"},
        notEmpty: {msg: "Please be sure to not leave this blank."}
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Please be sure to enter an author!"},
        notEmpty: {msg: "Please be sure not to leave this blank!"}
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    sequelize,
    // modelName: 'Book',
  });
  return Book;
};