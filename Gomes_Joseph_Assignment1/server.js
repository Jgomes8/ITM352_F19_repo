var express = require('express'); //call express
var myParser = require("body-parser");
var data = require('./public/product.js'); //???
var app = express(); //initialize express
/* NOT NEEDED?
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); //This should be console.log because we don't want to respond.
    next(); 
});
*/
//We'll need to install parser addon for this code to work
app.use(myParser.urlencoded({ extended: true }));

//PROCESS FORM
//This will allow us to actually get the inputted data. "When I input the form, get the process form submission from the server"


//NON-NEG CHECK


//Display Purchase (Invoice Output)



/*NEW!!!
Since we are using POST method on index.html line 19, we would use app.post to grab our
data and put it into... 'process_form'.
*/
app.post("/process_form", function (request, response) {
   let POST = request.body; 
/*NEW!
We created this for loop to grab products from our quantityPurchased forms and 
then check to see if we have valid data before giving invoice
*/
    var hasValidQuantities = true; //We use this to see if whatever is outputted in our  
    var hasPurchases = false;
    for (i = 0; i < products.length; i++) {
        q = POST[`quantityPurchased${i}`];
        if(isNonNegInt(q == false)) { //Does nonneg function
            hasValidQuantities = false;
        } 
        if (q > 0) {
            hasPurchases = true;
        }
   }
    //If my form data has textbox/input called quantity_textbox and it has an actual value (not undefined) then I have data and am ready to do something
    if (hasValidQuantities && hasPurchases) {
        displayPurchase(POST, response); //If I have data, display my purchase
    } else {
        response.send("invalid data please resubmit");
    } 

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
/*
THIS IS WHERE WE OUTPUT OUR INVOICE IF TRUE
*/
function displayPurchase(POST, response) {
    //Here, because we created a quantity_form, everything in it becomes an attribute of said form, so it lets us use .dot notation
    response.send("Invoice!")
}