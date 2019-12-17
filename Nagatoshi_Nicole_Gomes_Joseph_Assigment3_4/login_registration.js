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
    if (err) throw errl
    console.log("Connected!");
});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/loginandreg.html'));
});

app.post("./LoginInvoice.html", function(request, response) {
	var username = request.body.uname;
	var password = request.body.psw;
	if (username && password) {
		connection.query('SELECT * FROM user_info WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
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

app.post("./reg", function(request, response) {
    var name = request.body.fullname;
    var username = request.body.field_username.toLowerCase();
    var password = request.body.field_pwd1;
    var confirm_pass = request.body.field_pwd2;
    if(username && (password == confirm_pass)) {
        var sql = "Insert Into Users values(null, '"+ request.body.fullname +"', '"+ request.body.field_username +"', '"+ request.body.email +"', '"+ request.body.field_pwd1 +"')";
        connection.query(sql);
        response.redirect('./LoginInvoice.html');
    }
});

app.listen(8080);