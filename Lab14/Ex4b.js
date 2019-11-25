/*
With our new code, we are saying...
If we get a get a get request, we are going to run a function to generate a registration form.
When we run this, the method is "POST" so it will post our data to register. 
*/
var express = require('express'); //Added express server module
var app = express();
var myParser = require("body-parser"); //added parser module
var fs = require('fs'); //Load in filesystem module, apply to fs variable

app.use(myParser.urlencoded({ extended: true }));
var filename = 'user.data.json';

if (fs.existsSync(filename)) { //This will go and check if a filename exists and then returns true or false or runs some code.  We will run this in an if statement.
    stats = fs.statSync(filename); //We will use the statSync, apply it to variable stat
    console.log(filename + ' has ' + stats.size + ' characters'); //The .size stat will output CHARACTERS
    
    data = fs.readFileSync(filename, 'utf-8'); 
    //Here we load in our json data
    users_reg_data = JSON.parse(data); //This will move through our data string from a json file and turn it into an object
    
    //This will append/add a new user to our json data.  Once we have run it ONCE, we no longer need it as it has written the new data to our JSON file.
    /*
    username = 'newuser';
    users_reg_data[username] = {};
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';

    fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //This will turn ___ into a string
    */

    //console.log(users_reg_data['itm352'].password); //Console log for testing (shows actual object properties) NOTE: ONLY FOR A SPECIFIC USER/property
    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!'); //If our file doesnt exist, run other code
}

//This will give us a simple login form. Our URL will run a GET request which will run a function to generate the login form.
//RECOMMENDATION: for Assignment 2 load login page as its own file
app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

//If our server gets a POST request to login, run this instead of the above!
app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    //The body-parser will alow us to grab the data from the request.body(?)
    console.log(request.body); //Allows us to check if we are recieving POST data.  We now want to check if this info is correct then send our user to the invoice(?)
    the_username = request.body.username; //Username is one of the properties of our form! Check console; we get username and password! This is telling us to assign that to a new variable
    if(typeof users_reg_data[the_username] != 'undefined') { //If our json data has a property called the_username (grabbed from login page), then run this code (because then that username is defined and exists!)
        if (users_reg_data[the_username].password == request.body.password) { //If the json password data matches what came from our POST request, run more code by sending them to the thank-you login page/invoice
            response.send(the_username + ' logged in!');
        } else {
            response.redirect('/login'); //redirect back to the login page if the username and password isn't defined/recognized
        }
    }
});

//NEW CODE for EX4b.js
app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

 app.post("/register", function (request, response) {
    // process a simple register form

    //Validate our registration data! Case-sensitive and usernames must be unique, passwords must have a certain length/etc.

    //Data is valid so save new user to our file user.data.json
    username = request.body.username; //get username
    users_reg_data[username] = {}; //create empty object for array
    users_reg_data[username].password = request.body.password; //get password from password textbox (the .password looks at password textbox name found in script above, the name="" value is password)
    users_reg_data[username].email = request.body.email; //get email from email textbox

    fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //This will turn ___ into a string
 
    response.send(`${username} registered`);
});


//Listen to port 8080 to launch server/website/etc.
app.listen(8080, () => console.log(`listening on port 8080`));
