/*
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

var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var filename = 'managerpassword.json';
var customer_id = null;


var app = express(); //Initialize express module for sessions, requests, etc.

//Connect to customer_registration_data database
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'customer_registration_data'
});


//Used to check if database is connected. Error checking code from https://www.w3schools.com/nodejs/nodejs_mysql.asp
connection.connect(function(err) {
    if (err) throw err
    console.log("Connected!");
});

app.use(express.static('static_files'));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

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

//Display registration.html page
// app.get('/reg', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/registration.html'));
// });

app.post("/reg", function(request, response) {
        var sql = "INSERT INTO `user_info`(`cust_id`, `fullname`, `username`, `email`, `password`) VALUES (null, '"+ request.body.fullname +"', '"+ request.body.username +"', '"+ request.body.email +"', '"+ request.body.pwd1 +"')";
        connection.query(sql, function(err, result) {
			if(err) throw err;
			console.log('Added to table');

		});
        response.redirect('/loginandreg.html');

});


//Will redirect to file post_reg.html after registration above
app.get('/LoginInvoice', function(request, response) {
	response.sendFile(__dirname + '/LoginInvoice.html');
  });

// app.post('/post_reg', function(request, response) {
// 	response.send('hi');
// });

/*
app.post('/points', function(request, response) {
 	console.log('Connected 2!');
 	var points_sql = "UPDATE user_info SET points = '"index"' WHERE cust_id='"customer_id"' ";
 	connection.query(points_sql, function (err, result) {
 		if (err) throw err;
 		console.log("Updated Table");
 	})
 });
 */


if (fs.existsSync(filename)) { 
    stats = fs.statSync(filename); 
    loginData = fs.readFileSync(filename, 'utf-8') 
	manager_data = JSON.parse(loginData);
	console.log(manager_data);
} else {
    console.log(filename + ' does not exist!'); 
}

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

app.listen(8080);