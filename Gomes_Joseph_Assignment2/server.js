/*
APP INFO:

>Created by Joseph Gomes
>This is a program that allows you to shop for items from a storefront, register as a user, and once registered produce an invoice for
the selected products. Pages for this app are generated through the server using basic HTML templates which are loaded in through redirects
upon submit button selection.  
---------------------------------------
TEMPLATE INFO:
HTML templates are loaded in to create webpages.

>Initial template layouts taken from/inspired by Lab 13
>HTML validation pattern attribute used from https://www.w3schools.com/tags/att_input_pattern.asp
>Regex validation for HTML forms aided by https://www.rexegg.com and https://www.rexegg.com/regex-quickstart.html
>HTML validation attribute custom messages used from Somnath Kadam @ https://stackoverflow.com/questions/5272433/html5-form-required-attribute-set-custom-validation-message
>HTML email regex information taken used Anton Bessonov @ https://stackoverflow.com/questions/5601647/html5-email-input-pattern-attribute
    >oninput="this.setCustomValidity('')" used to overwrite base HTML5 form validation messages with custom messages
    >oninvalid="this.setCustomValidity('Please input your password here. Must match above form.')" used to create custom invalid messages
*/

var express = require('express'); //run express module
var myParser = require("body-parser"); //run body parser module
var data = require('./public/product.js'); 
var fs = require('fs'); //Load in filesystem module, apply to fs variable; renders template string for .view files & login data .json
var app = express(); //initialize express server module
var filename = 'user_registration_info.json' //set variable filename to data stored in user_registration_info.json file

//We are using this as a way to confirm that for each app.(something), what type of request are we getting? 
//i.e. POST or GET? We need to confirm this because the different redirects use GET method but our data is passed using POST data (from templates).  App.get will run templates, app.post will run validation/main script
app.all("*",function(request, response, next) {
    console.log(request.method, request.path);
    next(); //move on to next code
});

//We'll need to install parser addon for this code to work
app.use(myParser.urlencoded({ extended: true })); 

//-----PROCESS FORM----------------------------------------------------------------------------
/*Code used created with aid of Dr. Port
This will allow us to actually get the inputted data. "When I input the form, get the process form submission from the server"

(LINE 48) Since we are using POST method on shop_page.html line 16, we would use app.post to grab our
data and create an action/page called 'process_form'.

(LINE 53) We created this for loop to grab products from our quantityPurchased forms and 
then check to see if we have valid data before giving invoice
*/
var somethingquantities = {}; //Global variable for keeping shop quantities across entire server generation
app.post("/process_form", function (request, response) {
    let POST = request.body; //Whatever your post request data is, will save to POST variable
    somethingquantities = POST; //pass POST data to global variable somethingquantities
    var hasValidQuantities = true; //Create variable; consider default quantities as 'true' (nonNeg)
    var hasPurchases = false; //Create variable; consider no items purchased yet
    for (i = 0; i < products.length; i++) {
        var q = POST[`quantityPurchased${i}`]; //Variable q holds POSTed data of quantities inputted
        if(isNonNegInt(q == false)) { //Runs isNonNegInt function for q
            hasValidQuantities = false; //If q is false, set variable to false (quantity is not an int)
        } 
        if (q > 0) { //If q variable greater than 0
            hasPurchases = true; //And item has been purchased, set variable to true
        }
        console.log(hasValidQuantities, hasPurchases); //Check data in console
   }
    /*
    If var hasValidQuantities and var hasPurchases are true, redirect user to a login page.
    Otherwise, if those variables are false, output an invalid message
    */
    if (hasValidQuantities && hasPurchases) { //If both hasValidQuantities and hasPurchases are true
        
        //Temporary redirect (307) that was previously found here used from https://stackoverflow.com/questions/38810114/node-js-with-express-how-to-redirect-a-post-request
        response.redirect('/login'); //If I have data(above), redirect to login page action
    } else { //Else send user to Error page; uses some internal css
        response.send(` 
            <head>
                <link href="shop_css.css" rel="stylesheet">
                <style>
                    header {
                        width: 585px;
                        margin: auto;
                        background-color: mintcream;
                        border: 6px solid black;
                    }
                </style>
            </head>
            <header>
                <img src="images/warning.png" height="200" width="200">
                <h1>Warning: Invalid Data Submitted</h1>
                <p>You have submitted an incorrect amount. Please hit the back button and try again.</p>
            </header>
        `);
    } 
});

//-----Check login info existence------------------------------------------------------------
/*
Taken from Lab14. Used to check login file exists.
*/

if (fs.existsSync(filename)) { //This will go and check if a filename exists and then returns true or false or runs some code.  We will run this in an if statement.
    stats = fs.statSync(filename); //We will use the statSync, apply it to variable stat
    loginData = fs.readFileSync(filename, 'utf-8') //reads filename variable (user_registration_info.json) and applies to loginData variable
    //console.log(typeof loginData);                //TEST see if string data is recieved.
    users_reg_data = JSON.parse(loginData);         //This will move through our data string from our json file (user_registration_info.json) and turn it into an object
    //console.log(typeof users_reg_data);           //TEST see if data is now an object
    //console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!'); //If our file doesnt exist, run other code
}

//-----Display Login Page (After Purchase Selection)--------------------------------------------
/*
We use app.get method for redirect and to load the login_template.view file
Then we move to an app.post to process our login page form 
*/
app.get("/login", function (request, response) {
    var loginStuff = fs.readFileSync('./login_template.view', 'utf8'); //Sync file to login_template.view file
    response.send(loginStuff); //Generate this template to /login page
});

app.post("/login", function (request, response) {
    //console.log(request.body); //Allows us to check if we are recieving POST data.  We now want to check if this info is correct then send our user to the invoice/login
    the_username = request.body.username.toLowerCase(); /*Username is one of the properties of our form! Check console; we get username and password! This is telling us to assign that to a new variable
                                                        .toLowerCase() used to make username inputted case insensitive; forces form input to lowercase; used from https://www.w3schools.com/jsref/jsref_tolowercase.asp*/
    if(typeof users_reg_data[the_username] != 'undefined') { //If our json data has a property called the_username (grabbed from login page), then run this code (because then that username is defined and exists!)
        if (users_reg_data[the_username].password == request.body.password) { //If the json password data matches what came from our POST request, run more code by sending them to the thank-you login page/invoice
            displayPurchase(the_username, response); //If username from the request form is equal to our json data variable, run our displayPurchase function to show invoice.  Pass both the_username data for personalization and response
        } 
    } else { //This will alert the user if their login information does not match. Upon closing the alert it will redirect the user back to the login page.
        response.send(`
        <head>
            <meta http-equiv="refresh" content="5">
        </head>
        <script>
            alert('Your username or password is incorrect! Please try again. If you are a new user please register before continuing with your purchase!');
            document.location='/login';
        </script>
        `)
    }
});

//-----Display Registration Page (After Button Selection from Login)------------------------
/*
We use app.get method for redirect and to load the registration_template.view file
Then we move to an app.post to process our registration page form 
*/
app.get("/register", function (request, response) {
    var registerStuff = fs.readFileSync('./registration_template.view', 'utf8'); //Sync file to registration_template.view file
    response.send(registerStuff); //Generate this template to /register page

});

app.post("/register", function (request, response) {
    the_username = request.body.username.toLowerCase(); //Take request from username formfield and apply to new variable (the_username)
    var pass = request.body.password; //create variable of data in password form field
    var confirm_pass = request.body.confirmPassword; //create variable of data in confirmPassword form field
    //console.log(pass, confirm_pass); //used to check if form data is being grabbed
    
    //Based on what is inputted in registration form fields, one of 3 scenarios will occur:
    //If a username put into the username register form field is not undefined and can be found in the users_reg_data, then output username error alert, then redirect back to register page
    if(users_reg_data[the_username] != undefined) {
        response.send(`
        <head>
            <meta http-equiv="refresh" content="5">
        </head>
        <script>
            alert('The username you have selected is already in use. Please choose a new username and try again.');
            document.location='/register';
        </script>
        `)
        /*OLD: if username put into register form field is not undefined and exists in the users_reg_data json, generate an html error page
        response.send(` 
            <head>
                <link href="shop_css.css" rel="stylesheet">
                <style>
                    header {
                        width: 585px;
                        margin: auto;
                        background-color: mintcream;
                        border: 6px solid black;
                    }
                </style>
            </head>
            <header>
                <img src="images/warning.png" height="200" width="200">
                <h1>Warning: Username Already In Use</h1>
                <p>The username you have selected is already in use. Please select the back button and choose a new username.</p>
            </header>
        `);
        */
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
        /*OLD: If passwords do not match, generate an html error page
        response.send(` 
        <head>
            <link href="shop_css.css" rel="stylesheet">
            <style>
                header {
                    width: 585px;
                    margin: auto;
                    background-color: mintcream;
                    border: 6px solid black;
                }
            </style>
        </head>
        <header>
            <img src="images/warning.png" height="200" width="200">
            <h1>Warning: Passwords Do Not Match</h1>
            <p>The passwords you have inputted do not match. Please select the back button and reconfirm your password to continue with registration.</p>
        </header>
        `);
        */
    }
    //If the_username is not a defined object in our json array (defined as users_reg_data) and the input of the password form field & confirm password form fields are the same then register new user
    var newReg = false;
    if((users_reg_data[the_username] == undefined) && (pass == confirm_pass)) {
            users_reg_data[the_username] = {}; //create empty object for array called the_username
            users_reg_data[the_username].fullName = request.body.fullName; //get fullName from fullName textbox in the register form and add it to the new object array
            users_reg_data[the_username].password = request.body.password; //get password from password textbox in the register form (name="") and add it to the new object array
            users_reg_data[the_username].email = request.body.email; //get email from email textbox in register form and add it to the object array
            
            fs.writeFileSync(filename, JSON.stringify(users_reg_data, null, 2)); //This will turn our object into a JSON string (null,2 keeps file neat)
        
            var newReg = true;
    } 
    if(newReg = true) {
        displayPurchase(the_username, response); //If username from the request form is equal to our json data variable, run our displayPurchase function to show invoice.  Pass both the_username data for personalization and response
    }
});

//-----NON-NEG CHECK------------------------------------
/* function used taken from Lab 13 files.

Check to make sure our form data is a non-neg integer. This will run through the
if statement through the process form function above.
*/
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!');    // Check if string is a number value
    if(q < 0) errors.push('Negative value!');           // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0); 
}

//-----Display Purchase (Invoice Output)------------------------------------
/* 
We will be using this function to display the invoice. 
This will be created using a template file which is called as our 
response to the validation process in app.post above

Original Code in copy: continually add to empty string outStr then 
have the response call the completed string. Template usage modified 
through Dr. Port's assistance.
*/
function displayPurchase(the_username, response) {
    subtotal = 0; //Define subtotal variable
    
    //Modified from Assignment1_MVC_Example
    invoiceRows = ""; //Define empty invoiceRows variable; invoiceRows will be filled to display items based on gotten quantities
    for (i=0; i<products.length; i++){
        quants = 0; //define quants variable as 0
        if(typeof somethingquantities[`quantityPurchased${i}`] != 'undefined') { 
            var quants = somethingquantities[`quantityPurchased${i}`]; //Defines quants variable to equal values grabbed by post from quantityPurchased boxes
        }
        if (quants > 0) {
            extended_price = quants * products[i].price; //Define extended_price variable; solve by multiplying quants by item array price
            subtotal += extended_price; //Increase subtotal by adding the extended_prices
            invoiceRows += //Add to invoiceRows a line per valid purchase
            (`
                <tr>
                    <th style="text-align: center;" width="43%">${products[i].name}</th>
                    <th style="text-align: center;" width="11%">${quants}</th>
                    <th style="text-align: center;" width="13">$${products[i].price}</th>
                    <th style="text-align: center;" width="%">$${extended_price}</th>
                </tr>
            `);
        }
    }
//Define and solve for additional invoice functions
    //Sales Tax
        var tax = 0.0575*subtotal;
    //Shipping Cost
        var shipping
            if(subtotal < 50) {
                shipping = 2;
            } else if(subtotal >=50 && subtotal < 100) {
                shipping = 5;
            } else {
                shipping = subtotal*0.05;
            }
    //Grand Total
        var grandTotal = subtotal+tax+shipping;

//Set contents variable; used to read/access the invoice_template.view file 
        var contents = fs.readFileSync('./invoice_template.view', 'utf8');
        response.send(eval('`' + contents + '`')); /* Play response for valid purchases using 
        template view file; backticks used to allow for template strings '${}' found in the template file */
}


app.use(express.static('./public'));                            //We are telling express to use the public folder
app.listen(8080, () => console.log(`listening on port 8080`)); //Our server will listen on port 8080