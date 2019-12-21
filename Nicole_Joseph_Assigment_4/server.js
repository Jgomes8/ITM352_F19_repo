/*
Server used to run json and sqlite database login/registration systems and manager fetch systems.
JSON login/registration systems taken from previous assignments.
Legacy code used for scrapped SQL database system (works!).



OLD info below: SQL database creation
------
CREATE DATABASE customer_registration_data DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE customer_registration_data;

CREATE TABLE user_info (
  cust_id int(11) NOT NULL AUTO_INCREMENT, 
  fullname varchar(255) NOT NULL, 
  username varchar(50) NOT NULL, 
  email varchar(100) NOT NULL, 
  password varchar(255) NOT NULL,
  PRIMARY KEY (cust_id)
  );
  
  INSERT INTO user_info (fullname, username, email, password) VALUES ("John Doe", "john_test", "john_test@gmail.com", "test_pass");

ALTER TABLE user_info
ADD points int(11)

ALTER TABLE user_info
ADD freeDrink int(11)

ALTER TABLE user_info
ADD CONSTRAINT check_points CHECK (points<=9)

//------------------------------------------------------------
//NOTE: Database created myself using reference from 
//------------------------------------------------------------
>https://www.khanacademy.org/computing/computer-programming/sql
>https://codeshack.io/basic-login-system-nodejs-express-mysql/
>https://www.techonthenet.com/mysql/primary_keys.php
>https://www.w3schools.com/sql/sql_autoincrement.asp

>We are first creating a database called customer_registration_data which we will store all customer info
>Then we will create a table within that database called user_info to store registered users
>This table will contain a customer ID which will increment for each new user, their full name, username, email, and password.  We also set the customer ID as the primary key
>Then we added in a test user account for login testing.
>Additionally added 2 extra columns to store information regarding punch card punches and free drinks earned with a check in place for points values to only be less than or equal to 9 (# of punches on card)
*/

var express = require('express'); //require express module
var session = require('express-session'); //require express-session module
var bodyParser = require('body-parser'); //require body-parser module
var path = require('path'); //require path module
var fs = require('fs'); //require file system module

var filename = 'user_registration_data.json'; //set variable to data stored in json file
var filename2 = 'managerpassword.json'; //set variable to data stored in json file

var app = express(); //Initialize express module for sessions, requests, etc.
var sqlite3 = require('sqlite3'); //Require/load in sqlite3 module in node.js
var db = new sqlite3.Database('customer_data.db'); //Set db variable as database info

app.use(express.static('static_files')); //have express use files stored in static_file directory

app.use(bodyParser.urlencoded({extended : true})); //body parser application
app.use(bodyParser.json());

//Check if json file exists for login and registration
if (fs.existsSync(filename)) { 
    stats = fs.statSync(filename); 
    loginData = fs.readFileSync(filename, 'utf-8') 
	user_reg = JSON.parse(loginData); //set parsed text to user_reg variable
	console.log(user_reg);
} else {
    console.log(filename + ' does not exist!'); 
}

//Check if json file exists for manager login
if (fs.existsSync(filename2)) { 
    stats = fs.statSync(filename2); 
    loginData2 = fs.readFileSync(filename2, 'utf-8') 
	manager_data = JSON.parse(loginData2); //set parsed text to manager_data variable
	console.log(manager_data);
} else {
    console.log(filename2 + ' does not exist!'); 
}

//get index.html upon server start
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});


//-------------------------------------------------------------------------------
//Customer Login Methods
//-------------------------------------------------------------------------------

//get 
app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/loginandreg.html'));
});

//Old SQL database working code for login
/*
app.post("/login", function(request, response) {
	var username = request.body.uname;
	var password = request.body.psw;
	if (username && password) {
		connection.query('SELECT * FROM user_info WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				customer_id = results.cust_id;
				request.session.loggedin = true;
				request.session.uname = username;
				response.redirect('./LoginInvoice.html');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
*/

//-------------------------------------------------------------------------------
//Customer Registration Methods
//-------------------------------------------------------------------------------
//Old sqlite-jquery based registration method.
/*
app.post('/reg', (request, response) => { //I want to POST new data to data collection
	console.log(request.body);
	
	//To insert into the database, we must use a db.run
	//This doesnt grab data, but instead just runs a SQL query
	db.run(
	  'INSERT INTO user_info VALUES ($fullname, $username, $email, $password)',
	  { //When the above query is run, the below parameters is passed into the SQL query variables
		$fullname: request.body.fullname,
		$username: request.body.username,
		$email: request.body.email,
		$password: request.body.password
	  },
	  //Run callback if there is an error
	  (err) => {
		if (err) {
		  console.log({message: 'Error'});
		} else {
		  console.log({message: 'Successful registration'})
		}
	  }
	);

	
	//response.redirect('/loginandreg.html');
});
*/

//Get loginandreg page to run app.post method
app.get('/reg', function(request, response) {
	response.sendFile(path.join(__dirname + '/loginandreg.html'));
});

//registration to json file from loginandreg.html
app.post("/reg", function(request, response) {
	username = request.body.username;
	var psw = request.body.pwd1;
	var con_psw = request.body.pwd2;	
	if((user_reg[username] = undefined) && (psw == con_psw)) {
		user_reg[username] = {}; //create empty object for array called the_username
		user_reg[username].fullName = request.body.field_fullname; //get fullName from fullName textbox in the register form and add it to the new object array
		user_reg[username].email = request.body.field_email; //get email from email textbox in register form and add it to the object array
		user_reg[username].password = request.body.field_pwd1; //get password from password textbox in the register form (name="") and add it to the new object array
		
		fs.writeFileSync(filename, JSON.stringify(users_registration_info, null, 2)); //This will turn our object into a JSON string (null,2 keeps file neat)

		//Once registered, will redirect registered user back to the Login and registration page to login before continuing
        response.redirect('/loginandreg.html');
	}
});


//Will redirect to file LoginInvoice.html after registration above
app.get('/LoginInvoice', function(request, response) {
	response.sendFile(__dirname + '/LoginInvoice.html');
  });


//-------------------------------------------------------------------------------
//Manager Login Method
//-------------------------------------------------------------------------------

//Get managerlogin page
app.get('/managerlogin', function(request, response) {
	response.sendFile(path.join(__dirname + '/managerlogin.html'));
});

//Run managerlogin login code
app.post('/managerlogin', function(request, response) {
	mang_user = request.body.manager_user;
	console.log(mang_user);

	if(typeof manager_data[mang_user] != 'undefined') {
		if(manager_data[mang_user].managerPass == request.body.manager_psw) {
			response.redirect('/manager.html');
		}
	} else {
		response.send('Incorrect Login!');
	}
});

//-------------------------------------------------------------------------------
//Manager Check Customer Info from Database system
//-------------------------------------------------------------------------------

// Get username information
//
app.get('/users', (request, response) => {
	//To do a database query in SQLite, we use the following function
	db.all('SELECT username FROM user_info', (err, rows) => { //run a query in SQL then run a callback function after it finishes. This function throws an error parameter and then manages database/table row info
	  console.log(rows); //View database row output
	  var allUsernames = rows.map(e => e.username); //calling map on rows will iterate through every element then assign to temp variable e. Arrow => will create a function that takes an e variable and returns e.name (aka the usernames)
	  console.log(allUsernames); //View database usernames
	});
});
  
// Get specific user information 
//
app.get('/users/:userid', (request, response) => {
	var nameToLookup = request.params.userid; // set variable to userid from URL (the username we are grabbing when inputted into text box)
	
	//We want to get the :userid using our new sqlite database
	//
	db.all(
	  'SELECT * FROM user_info WHERE username=$username', //SQL query; select all columns from the user_info table based on information grabbed from username element
	 //db.all parameters 
	  { //object mapping the $name variable
		$username: nameToLookup //When I visit a specific localhost above, it will pass the username URL to nameToLookup variable
	  },
	  //Callback function to run when query finishes
	  //
	  (err, rows) => {
		console.log(rows); //console log table rows to confirm data is being recieved 
		if (rows.length > 0) { //
		  response.send(rows[0]); //We want to respond to the URL with the object in 0 spot of array index (aka usernames)
		} else { //else statement when theres an error respond to webpage with an empty object
		  response.send({});
		}
	  }
	)

  });

  app.listen(8080, () => { console.log('Server started at http://localhost:8080/');});