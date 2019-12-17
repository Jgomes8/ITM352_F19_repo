var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

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

//app.use(express.static('static_files'));

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
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post("/login", function(request, response) {
	var username = request.body.uname;
	var password = request.body.psw;
	if (username && password) {
		connection.query('SELECT * FROM user_info WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.uname = username;
				response.redirect('./post_reg');
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
app.get('/reg', function(request, response) {
	response.sendFile(path.join(__dirname + '/registration.html'));
});

app.post("/reg", function(request, response) {
        var sql = "INSERT INTO `user_info`(`cust_id`, `fullname`, `username`, `email`, `password`) VALUES (null, '"+ request.body.fullname +"', '"+ request.body.field_username +"', '"+ request.body.email +"', '"+ request.body.field_pwd1 +"')";
        connection.query(sql, function(err, result) {
			if(err) throw err;
			console.log('Added to table');

		});
        response.redirect('/post_reg');

});

//Will redirect to file post_reg.html after registration above
app.get('/post_reg', function(request, response) {
	response.sendFile(__dirname + '/post_reg.html');
  });

app.post('/post_reg', function(request, response) {
	response.send('hi');
});

app.listen(8080);