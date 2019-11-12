var express = require('express'); //call express
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/product_data.js');
var products = data.products;

var app = express(); //initialize express
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); //This should be console.log because we don't want to respond.
    next(); 
});

//We'll need to install parser addon for this code to work
app.use(myParser.urlencoded({ extended: true }));
//This will allow us to actually get the inputted data. "When I input the form, get the process form submission from the server"
app.post("/process_form", function (request, response) {
    process_quantity_form(request.body, response);
});

//We replaced the response.send above with console.log as otherwise the below app.use would not recieve requests. Now the app.use will send a response to a request
app.use(express.static('./public')); //We are telling express to use public folder
app.listen(8080, () => console.log(`listening on port 8080`));

//Now that we have our data, we want to check it to make sure its good data.
//Check to make sure our form data is a non-neg integer
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0); 
}
//Since were pasting this outside of app.post, we have to add the argument (response) to pass it in
function displayPurchase(POST, response) {
    //Here, because we created a quantity_form, everything in it becomes an attribute of said form, so it lets us use .dot notation
    if (typeof POST['quantity_textbox'] != 'undefined') {
        let q = POST['quantity_textbox'];
        if (isNonNegInt(q)) {
            var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
            response.send(eval('`' + contents + '`')); // render template string
        } else {
            response.send(`${q} is not a quantity!`);
        }
    }
}
function process_quantity_form (POST, response) {
    if (typeof POST['quantity_textbox'] != 'undefined') {
        displayPurchase(POST, response); //If I have data, display my purchase
    }
    let model = products[0]['model'];
    let model_price = products[0]['price'];
}