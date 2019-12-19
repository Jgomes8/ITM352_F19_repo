// Node.js + Express server backend for petsapp
// v2 - use SQLite (https://www.sqlite.org/index.html) as a database
//
// COGS121 by Philip Guo
// https://github.com/pgbovine/COGS121

// run this once to create the initial database as the pets.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm pets.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('customer_data.db');

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE user_info (fullname TEXT NOT NULL, username TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, points TEXT)");

  // insert 2 rows of data:
  db.run("INSERT INTO user_info VALUES ('John Doe', 'john_test', 'john_test@gmail.com', 'testing', 'StampCardOne.jpg')");
  db.run("INSERT INTO user_info VALUES ('ITM 352', 'itm352', 'itm352@gmail.com', 'grader', 'StampCardTwo.jpg')");

  console.log('successfully created the user_info table in customer_data.db');

  // print them out to confirm their contents:
  db.each("SELECT fullname, username, email, password, points FROM user_info", (err, row) => {
      console.log(row.fullname + ", " + row.username + ", " + row.email + ", " + row.password + ", " + row.points);
  });
});

db.close();
