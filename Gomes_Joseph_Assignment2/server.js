var express = require('express'); //run express
var myParser = require("body-parser");
var data = require('./public/product.js'); 
var fs = require('fs'); //Load in filesystem module, apply to fs variable; renders template string for .view files & login data .json
var app = express(); //initialize express
var filename = 'user_registration_info.json'

//We'll need to install parser addon for this code to work
app.use(myParser.urlencoded({ extended: true })); 

//-----PROCESS FORM------------------------------------
/*Code used created with aid of Dr. Port
This will allow us to actually get the inputted data. "When I input the form, get the process form submission from the server"

(LINE 25) Since we are using POST method on shop_page.html line 19, we would use app.post to grab our
data and put it into... 'process_form'.

(LINE 29) We created this for loop to grab products from our quantityPurchased forms and 
then check to see if we have valid data before giving invoice
*/
app.post("/process_form", function (request, response) {
    let POST = request.body; 
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
If var hasValidQuantities and var hasPurchases are true, output the displayPurchases function
Otherwise, if those variables are false, output an invalid message
*/
    if (hasValidQuantities && hasPurchases) { //If both hasValidQuantities and hasPurchases are true
        
        //Temporary redirect (307) gotten from https://stackoverflow.com/questions/38810114/node-js-with-express-how-to-redirect-a-post-request
        newRegister(POST, response); //If I have data(above), use displayPurcahse function
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

app.use(express.static('./public'));                            //We are telling express to use the public folder
app.listen(8080, () => console.log(`listening on port 8080`)); //Our server will listen on port 8080

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

//-----Check login info existence-----------------------------
/*
Taken from Lab14. Used to check login file exists.
*/
if (fs.existsSync(filename)) { //This will go and check if a filename exists and then returns true or false or runs some code.  We will run this in an if statement.
    stats = fs.statSync(filename); //We will use the statSync, apply it to variable stat
    loginData = fs.readFileSync(filename, 'utf-8') //reads filename variable (user_registration_info.json) and applies to loginData variable
    //console.log(typeof loginData);                //TEST see if string data is recieved.
    users_reg_data = JSON.parse(loginData);         //This will move through our data string from our json file (user_registration_info.json) and turn it into an object
    //console.log(typeof users_reg_data);           //TEST see if data is now an object
    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!'); //If our file doesnt exist, run other code
}

//-----Display Login Page (After Purchase Selection)------------------------
/*

*/
app.post("/login", function (request, response) {
    console.log(request.body); //Allows us to check if we are recieving POST data.  We now want to check if this info is correct then send our user to the invoice(?)
    the_username = request.body.username; //Username is one of the properties of our form! Check console; we get username and password! This is telling us to assign that to a new variable
    if(typeof users_reg_data[the_username] != 'undefined') { //If our json data has a property called the_username (grabbed from login page), then run this code (because then that username is defined and exists!)
        if (users_reg_data[the_username].password == request.body.password) { //If the json password data matches what came from our POST request, run more code by sending them to the thank-you login page/invoice
            response.send(the_username + ' logged in!');
        } else {
            response.redirect('/login'); //redirect back to the login page if the username and password isn't defined/recognized
        }
    }
    /*
    if(typeof users_reg_data[the_username] == 'undefined') {
        response.redirect('/register');
    }
    */

    
    var loginstuff = fs.readFileSync('./login_template.view', 'utf8');
    response.send(eval('`' + loginstuff + '`')); /* Play response for valid purchases using 
    template view file; backticks used to allow for template strings '${}' found in the template file */
});



//-----Display Purchase (Invoice Output)------------------------------------
/* 
We will be using this function to display the invoice. 
This will be created using a template file which is called as our 
response to the validation process in app.post above

Original Code in copy: continually add to empty string outStr then 
have the response call the completed string. Template usage modified 
through Dr. Port's assistance.
*/
function displayPurchase(POST, response) {
    subtotal = 0; //Define subtotal variable
    
    //Modified from Assignment1_MVC_Example
    invoiceRows = ""; //Define empty invoiceRows variable; invoiceRows will be filled to display items based on gotten quantities
    for (i=0; i<products.length; i++){
        quants = 0; //define quants variable as 0
        if(typeof POST[`quantityPurchased${i}`] != 'undefined') { 
            var quants = POST[`quantityPurchased${i}`]; //Defines quants variable to equal values grabbed by post from quantityPurchased boxes
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

function displayLogin(POST, response) {
    var loginstuff = fs.readFileSync('./login_template.view', 'utf8');
    response.send(eval('`' + loginstuff + '`')); /* Play response for valid purchases using 
    template view file; backticks used to allow for template strings '${}' found in the template file */
}

function newRegister(POST, response) {
    var registrationstuff = fs.readFileSync('./registration_template.view', 'utf8');
    response.send(eval('`' + registrationstuff + '`')); /* Play response for valid purchases using 
    template view file; backticks used to allow for template strings '${}' found in the template file */
}

function checkRegistration() { //INSERT PARAMETERS
    
    //First name, only letters, no more than 30 characters, case insensitive

    //Last name, only letters, no more than 30 characters, case insensitive

    //Email X@Y.Z format, X can only contain letters,num,characters "_" or ".", Y can only contain letters, num, ".", Z must be 2 letters max, case insensitive
    
    //Username must be minimum 4 characters, max 10, letters and numbers only, case insensitive, unique
    
    //Password, all characters valid, minimum 6 characters, case sensitive

    //Confirm Pass, repeat above
}