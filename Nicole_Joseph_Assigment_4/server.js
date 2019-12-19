var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

//var filename = 'user_registration_data.json';
var filename2 = 'managerpassword.json';

var app = express(); //Initialize express module for sessions, requests, etc.
var sqlite3 = require('sqlite3'); //Require/load in sqlite3 module in node.js
var db = new sqlite3.Database('customer_data.db'); //Set db variable as database info

app.use(express.static('static_files'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

/*
if (fs.existsSync(filename)) { 
    stats = fs.statSync(filename); 
    loginData = fs.readFileSync(filename, 'utf-8') 
	user_reg = JSON.parse(loginData);
	console.log(user_reg);
} else {
    console.log(filename + ' does not exist!'); 
}
*/

if (fs.existsSync(filename2)) { 
    stats = fs.statSync(filename2); 
    loginData = fs.readFileSync(filename2, 'utf-8') 
	manager_data = JSON.parse(loginData);
	console.log(manager_data);
} else {
    console.log(filename2 + ' does not exist!'); 
}

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});


//-------------------------------------------------------------------------------
//Customer Login Methods
//-------------------------------------------------------------------------------

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/loginandreg.html'));
});

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

//-------------------------------------------------------------------------------
//Customer Registration Methods
//-------------------------------------------------------------------------------

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
		  console.log({message: 'error in app.post(/reg)'});
		} else {
		  console.log({message: 'successfully run app.post(/reg)'})
		}
	  }
	);
	
	//response.redirect('/loginandreg.html');
});

  /*
app.post("/reg", function(request, response) {
	username = request.body.username;
	var psw = request.body.pwd1;
	var con_psw = request.body.pwd2;	
	if((users_reg[the_username] == undefined) && (pass == confirm_pass)) {
		users_reg[the_username] = {}; //create empty object for array called the_username
		users_reg[the_username].fullName = request.body.fullName; //get fullName from fullName textbox in the register form and add it to the new object array
		users_reg[the_username].password = request.body.password; //get password from password textbox in the register form (name="") and add it to the new object array
		users_reg[the_username].email = request.body.email; //get email from email textbox in register form and add it to the object array
		
		fs.writeFileSync(filename, JSON.stringify(users_reg_data, null, 2)); //This will turn our object into a JSON string (null,2 keeps file neat)
	
		var newReg = true;

        response.redirect('/loginandreg.html');
	}
});
*/


//Will redirect to file LoginInvoice.html after registration above
app.get('/LoginInvoice', function(request, response) {
	response.sendFile(__dirname + '/LoginInvoice.html');
  });


//-------------------------------------------------------------------------------
//Manager Login Method
//-------------------------------------------------------------------------------

app.get('/managerlogin', function(request, response) {
	response.sendFile(path.join(__dirname + '/managerlogin.html'));
});

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

// GET a list of all usernames
//
app.get('/users', (request, response) => {
	//Lets do a database query. One type is a db.all
	db.all('SELECT username FROM user_info', (err, rows) => { //run a query in SQL then run a callback function after it finishes. This function throws an error parameter and then manages database/table row info
	  console.log(rows); //Output contents of rows from table
	  var allUsernames = rows.map(e => e.username); //calling map on rows will iterate through every element then assign to temp variable e. Arrow => will create a function that takes an e variable and returns e.name (e.g. John, Philip, Carol)
	  console.log(allUsernames); //Output only name values from rows
	});
});
  
// GET profile data for a user
//
app.get('/users/:userid', (request, response) => {
	var nameToLookup = request.params.userid; // matches ':userid' above
	
	//We want to get the :userid using our new sqlite database
	//
	db.all(
	  'SELECT * FROM user_info WHERE username=$username', //SQL query; select all columns from users_to_pets tables where name field matches $name variable
	  //parameters to pass into SQL query
	  //
	  { //object mapping the $name variable
		$username: nameToLookup //When I visit a specific localhost above, it will pass the userid URL to nameToLookup variable
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

  });

  app.listen(8080, () => { console.log('Server started at http://localhost:8080/');});