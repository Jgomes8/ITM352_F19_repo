var express = require('express'); //run express
var myParser = require("body-parser");
var data = require('./public/product.js'); 
var app = express(); //initialize express


/* NOT NEEDED?
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); //This should be console.log because we don't want to respond.
    next(); 
});
*/
//We'll need to install parser addon for this code to work
app.use(myParser.urlencoded({ extended: true }));

//-----PROCESS FORM------------------------------------
/*Code used created with aid of Dr. Port
This will allow us to actually get the inputted data. "When I input the form, get the process form submission from the server"

(LINE 25) Since we are using POST method on index.html line 19, we would use app.post to grab our
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
    if (hasValidQuantities && hasPurchases) {
        displayPurchase(POST, response); //If I have data, use displayPurcahse function
    } else {
        response.send(`
            <h1>Warning: Invalid Data Submitted</h1>
            <p>You have submitted an incorrect amount. Please hit the back button and try again.</p>
        `);
    } 
    
});

app.use(express.static('./public')); //We are telling express to use the public folder
app.listen(8080, () => console.log(`listening on port 8080`)); //Our server will listen on port 8080

//-----NON-NEG CHECK------------------------------------
/* function used taken from Lab 13 files.

Check to make sure our form data is a non-neg integer. This will run through the
if statement through the process form function above.
*/
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0); 
}

//-----Display Purchase (Invoice Output)------------------------------------
/* 
We will be using this function to display the invoice.
*/
function displayPurchase(POST, response) {
    
/*
Create a variable with an empty string
Add to the empty string table headers
For loop goes into effect, adds new rows to table using data from products array
Add closing table tag to string
Respond using string
*/

    subtotal=0;
    
    outStr = '<head><link href="shop_css.css" rel="stylesheet"></head>'; 
    outStr +=     
        `
        <table border="2" align=center>    
            <tbody>    
                <tr>
                    <th style="text-align: center;" width="43%">Item</th>
                    <th style="text-align: center;" width="11%">Quantity</th>
                    <th style="text-align: center;" width="13%">Price</th>
                    <th style="text-align: center;" width="54%">Extended price</th>
                </tr>
        `;
    for (i=0; i<products.length; i++){
        quants = 0;
        if(typeof POST[`quantityPurchased${i}`] != 'undefined') {
            var quants = POST[`quantityPurchased${i}`];
        }
        if (quants > 0) {
            extended_price = quants * products[i].price;
            subtotal += extended_price;
            outStr += 
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

    //Add empty invoice line
    outStr += 
    (`
    <tr>
        <td colspan="4" width="100%">&nbsp;</td>
    </tr>
    `)
    //Add Subtotal Line to Invoice string
    outStr +=
    (`
    <tr>
        <td style="text-align: center;" colspan="3" width="67%">Sub-total</td>
        <td style="text-align: center;" width="54%">$${subtotal.toFixed(2)}</td>
    </tr>
    `)
    //Add Tax Line to Invoice string
    outStr +=
    (`
    <tr>
        <td style="text-align: center;" colspan="3" width="67%"><span style="font-family: arial;">Tax @ 5.75%</span></td>
        <td style="text-align: center;" width="54%">$${tax.toFixed(2)}</td>
    </tr>
    `)
    //Add Shipping Line to Invoice string
    outStr +=
    (`
    <tr>
        <td style="text-align: center;" colspan="3" width="67%"><span style="font-family: arial;">Shipping</span></td>
        <td style="text-align: center;" width="54%">$${shipping.toFixed(2)}</td>
    </tr>
    `)
    //Add Grand Total Line to Invoice string
    outStr +=
    (`
    <tr>
        <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
        <td style="text-align: center;" width="54%"><strong>$${grandTotal.toFixed(2)}</strong></td>
    </tr>
    `)
        
    outStr += '</table>';
    response.send(outStr);
    
    
}