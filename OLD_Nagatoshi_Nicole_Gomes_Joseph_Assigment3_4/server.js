var express = require('express'); //run express module
var myParser = require("body-parser"); //run body parser modulevar fs = require('fs'); //Load in filesystem module, apply to fs variable; renders template string for .view files & login data .json 
var fs = require('fs');
var app = express(); //initialize express server module
var filename = 'registered_users.json' //set variable filename to data stored in registration json file

console.log(filename);

app.use(myParser.urlencoded({ extended: true })); 

if (fs.existsSync(filename)) { //This will go and check if a filename exists and then returns true or false or runs some code.  We will run this in an if statement.
    stats = fs.statSync(filename); //We will use the statSync, apply it to variable stat
    loginData = fs.readFileSync(filename, 'utf-8') //reads filename variable (user_registration_info.json) and applies to loginData variable
    users_reg_data = JSON.parse(loginData);         //This will move through our data string from our json file (user_registration_info.json) and turn it into an object
} else {
    console.log(filename + ' does not exist!'); //If our file doesnt exist, run other code
}

console.log(users_reg_data);

app.post("/reg", function (request, response) {
    user_ID = request.body.email.toLowerCase(); //Take request from username formfield and apply to new variable (the_username)
    var pass = request.body.psw; //create variable of data in password form field
    var confirm_pass = request.body.psw_repeat; //create variable of data in confirmPassword form field

    if(users_reg_data[user_ID] != undefined) {
        response.send(`
        <head>
            <meta http-equiv="refresh" content="5">
        </head>
        <script>
            alert('The username you have selected is already in use. Please choose a new username and try again.');
            document.location='/register';
        </script>
        `)
    }
    //If the password and confirmation password are not the same, output password error alert then redirect back to register form
    if(pass != confirm_pass) {
        response.send(`
        <head>
            <meta http-equiv="refresh" content="5">
        </head>
        <script>
            alert('The passwords you have inputted do not match. Please reconfirm your password to continue with registration.');
            document.location='/register';
        </script>
        `)
    }
    //If the_username is not a defined object in our json array (defined as users_reg_data) and the input of the password form field & confirm password form fields are the same then register new user
    var newReg = false;
    if((registered_users[user_ID] == undefined) && (pass == confirm_pass)) {
            users_reg_data[user_ID] = {}; //create empty object for array called the_username
            users_reg_data[user_ID].fullName = request.body.fullName; //get fullName from fullName textbox in the register form and add it to the new object array
            users_reg_data[user_ID].psw = request.body.password; //get password from password textbox in the register form (name="") and add it to the new object array
            
            fs.writeFileSync(filename, JSON.stringify(users_reg_data, null, 2)); //This will turn our object into a JSON string (null,2 keeps file neat)
        
            var newReg = true;
    } 
    if(newReg = true) {
        console.log('Testing');
    }
});