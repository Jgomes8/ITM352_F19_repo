
var attributes  =  "Joey;22;22.5;-21.5" ; 
theSeparator = ";";
parts = attributes.split(theSeparator);

//var attributes  =  "Joey;22;22.5;-21.5" ; 
//parts = ["Joey",22,22.52,21.5];
for(i=0; i < parts.length; i++) {
    console.log(`${parts[i]} isNonNegInt ${isNonNegInt(parts[i],true)}`); //typeof changed to
    //We HAVE to give the function here   ^^^^^^ something to call, since without something in () itll output null. You need to give it a parameter, which we use as parts[i]
    //This console.log is as follows: outputs the parts array; then we output the string isNonNegInt; then it will output the function analyzing our parts array (is it true or false/etc)
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