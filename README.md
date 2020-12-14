# JS-TD-P8-SQL-Library Manager
 
# Welcome to my Virtual Library App, powered by Express, Sequelize & Node.js.

## Purpose

This app makes use of Express, Sequelize & Node.js to pull book records from a database and display them in a list format.
When the user visits the homepage, they are re-directed to the first page of results. Each page displays up to 5 results,
and users can navigate between the pages by clicking the pagination buttons at the bottom of the window.

Users may also search for results. The search method is case-insensitve, and will also return partial matches. User's search
queries will be matched against the Title, Author, Genre and Year (of release) fields.

If a book is not listed in the database, clients are welcome to submit their own entries. If the 'Title' or 'Author' fields
are left blank, Sequelize will prevent the form from being submitted, and display a custom error message notifing the user
of their mistake.

Finally, users may also update any current entries listed in the library. As before, the same validation methods will be in place
on the 'Title' and 'Author' fields, to ensure they are not left empty.

#### How to run the App

To run the app, simply enter 'npm start' into the terminal and wait for the app to load!

#### Coding Layout

The main areas of this app are categorised into 3 folders - Models, Routes and Views.

The Models folder includes both index.js and book.js. Index.js initialises the database connection via Sequelize, and book.js
creates the book model. Inside the book model, 4 data types are created - 'title', 'author', 'genre' and 'year'. As well as
setting the data type for each column, I have also set the allowNull value to false, meaning that this field cannot be left empty.
If it is, a custom error message is provided, located inside 'notEmpty'.

Inside the routes folder, it is index.js that determines which routes are viewable by the user, and what is to be rendered to each
page. After requiring the Book model, it sets up a function that handles all asynchronous requests, called asyncHandler. Whilst not
entirely necessary, this does prevent a lot of repetition within each asynchronous function. Further notes on each route
and the functions provided to it are available to view within index.js

The views folder includes all of the templates that are displayed to the viewer. Most of these templates are fairly self-explanatory.
The index.pug file does a little more dynamic rendering however. If the allBooks variable has been passed, the template will display
a row in a HTML table for each entry. It also provides the pagination buttons at the bottom of the page. If there are no results,
the "Add a Book" button is displayed instead.

I hope you enjoy using this app. If you have any queries or ideas for further improvements, do not hesitate to contact me!

