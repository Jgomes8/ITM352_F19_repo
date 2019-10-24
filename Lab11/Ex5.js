
var attributes  =  "Joey;22;22.5;-21.5" ; 
theSeparator = ";";
parts = attributes.split(theSeparator);

//var attributes  =  "Joey;22;22.5;-21.5" ; 
//parts = ["Joey",22,22.52,21.5];

//for(i=0; i < parts.length; i++) {
    parts.forEach(function(item,index){
        console.log((typeof item == 'string' && item.length >0)?true:false)});

   
//}
function printIt(item, index) {
    console.log(`${item} isNonNegInt ${isNonNegInt(item,true)}`);
}

console.log(parts.join(theSeparator));


//Exercise 4a
/*
function isNonNegInt(q) {
    console.log('Hey! ' + q);
}
isNonNegInt(3); //<----This is being used to call the function; we are setting q to 3.
*/

//Exercise 4b
//This function: we will return this function if there are no non-negative arrays
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    //return(errors.length == 0);
    return returnErrors ? errors : (errors.length == 0); //returnErrors will return the parameter (false) if it is false. Otherwise it will output the error.length=0 code.
    //This ternary expression is shorthand if/else statement
}
console.log(isNonNegInt('10')); //This works because the function checks if this string is a non-neg integer; it doesnt matter what we give it, since its still a number itll come out as true.