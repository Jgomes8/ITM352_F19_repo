// start with ../petsapp-v1/server.js and work toward building ../petsapp-v2/server.js
//We didnt have to change anything on the frontend because they are already calling the same URLs

const express = require('express');
const app = express();

app.use(express.static('static_files'));

//We got rid of our fake database here to make a SQLite one
//To do this, we had to download sql modules (npm install sqlite or sqlite3)
//Then we ran existing database code doing node create_database.js

var sqlite3 = require('sqlite3'); //Require/load in sqlite3 module in node.js
var db = new sqlite3.Database('pets.db'); //Set db variable as database info

// GET a list of all usernames
//
// To test, open this URL in your browser:
//   http://localhost:8080/users
app.get('/users', (request, response) => {
  //Lets do a database query. One type is a db.all
  db.all('SELECT name FROM users_to_pets', (err, rows) => { //run a query in SQL then run a callback function after it finishes. This function throws an error parameter and then manages database/table row info
    console.log(rows); //Output contents of rows from table
    var allUsernames = rows.map(e => e.name); //calling map on rows will iterate through every element then assign to temp variable e. Arrow => will create a function that takes an e variable and returns e.name (e.g. John, Philip, Carol)
    console.log(allUsernames); //Output only name values from rows
    response.send(allUsernames); //Send data back to webpage that requested data
  });
  // console.log('allUsernames is:', allUsernames);
  // res.send(allUsernames);
});

// What if we want to add more users to database?
// We need to use POST request -> post new data to server
// GET -> get data from server (sorta)
// We will use a POST request, we need to use following module:
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); //hook up with your app

app.post('/users', (request, response) => { //I want to POST new data to data collection
  console.log(request.body);

  //To insert into the database, we must use a db.run
  //This doesnt grab data, but instead just runs a SQL query
  //
  db.run(
    'INSERT INTO users_to_pets VALUES ($name, $job, $pet)',
    { //When the above query is run, the below parameters is passed into the SQL query variables
      $name: request.body.name,
      $job: request.body.job,
      $pet: request.body.pet
    },
    //Run callback if there is an error
    (err) => {
      if (err) {
        response.send({message: 'error in app.post(/users)'});
      } else {
        response.send({message: 'successfully run app.post(/users)'})
      }
    }
  );
});

// GET profile data for a user
//
// To test, open these URLs in your browser:
//   http://localhost:3000/users/Philip
//   http://localhost:3000/users/Carol
//   http://localhost:3000/users/invalidusername
app.get('/users/:userid', (request, response) => {
  const nameToLookup = request.params.userid; // matches ':userid' above
  
  //We want to get the :userid using our new sqlite database
  //
  db.all(
    'SELECT * FROM users_to_pets WHERE name=$name', //SQL query; select all columns from users_to_pets tables where name field matches $name variable
    //parameters to pass into SQL query
    //
    { //object mapping the $name variable
      $name: nameToLookup //When I visit a specific localhost above, it will pass the userid URL to nameToLookup variable
    },
    //Callback function to run when query finishes
    //
    (err, rows) => {
      console.log(rows);
      if (rows.length > 0) {
        response.send(rows[0]); //We want to respond to the URL with the object in 0 spot of array index (aka Philip, John, etc. names)
      } else { //else statement when theres an error (respond w/ empty object)
        response.send({});
      }
    }
  )

  // if (val) {
  //   res.send(val);
  // } else {
  //   res.send({}); // failed, so return an empty object instead of undefined
  // }
});

// start the server at URL: http://localhost:3000/
app.listen(8080, () => {
  console.log('Server started at http://localhost:3000/');
});
